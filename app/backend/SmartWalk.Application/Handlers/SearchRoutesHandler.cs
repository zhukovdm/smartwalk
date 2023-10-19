using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using SmartWalk.Application.Interfaces;
using SmartWalk.Core.Algorithms;
using SmartWalk.Core.Entities;
using SmartWalk.Core.Extensions;
using SmartWalk.Core.Interfaces;
using SmartWalk.Core.Solvers;

namespace SmartWalk.Application.Handlers;

/// <summary>
/// Endpoint-specific handler.
/// </summary>
public sealed class SearchRoutesHandler : IQueryHandler<SearchRoutesQuery, List<Route>>
{
    private readonly IEntityIndex _entityIndex;
    private readonly IRoutingEngine _routingEngine;

    /// <summary>
    /// Time span dedicated to route calculation (in milliseconds).
    /// </summary>
    private static readonly int ROUTE_CALCULATION_TIME_LIMIT_MS = 1_000;

    private sealed class SolverPlaceComparer : IComparer<SolverPlace>
    {
        private SolverPlaceComparer() { }

        private static readonly Lazy<SolverPlaceComparer> _instance = new(() => new());

        public static SolverPlaceComparer Instance { get { return _instance.Value; } }

        public int Compare(SolverPlace l, SolverPlace r)
            => (l.idx != r.idx) ? l.idx.CompareTo(r.idx) : l.cat.CompareTo(r.cat);
    }

    private sealed class RouteComparer : IComparer<Route>
    {
        private RouteComparer() { }

        private static readonly Lazy<RouteComparer> _instance = new(() => new());

        public static RouteComparer Instance { get { return _instance.Value; } }

        public int Compare(Route l, Route r) => l.path.distance.CompareTo(r.path.distance);
    }

    /// <summary>
    /// Source before all (&amp; no loops!)
    /// </summary>
    /// <param name="sourceCat"></param>
    /// <param name="catsCount"></param>
    /// <returns></returns>
    private static IEnumerable<PrecedenceEdge> GetSourceEs(int sourceCat, int catsCount)
    {
        return from to in Enumerable.Range(0, catsCount) where to != sourceCat select new PrecedenceEdge(sourceCat, to);
    }

    /// <summary>
    /// All before target (&amp; no loops!)
    /// </summary>
    /// <param name="targetCat"></param>
    /// <param name="catsCount"></param>
    /// <returns></returns>
    private static IEnumerable<PrecedenceEdge> GetTargetEs(int targetCat, int catsCount)
    {
        return from fr in Enumerable.Range(0, catsCount) where fr != targetCat select new PrecedenceEdge(fr, targetCat);
    }

    /// <summary>
    /// Expand places to disjunct solver places.
    /// </summary>
    /// <param name="sourceCat"></param>
    /// <param name="targetCat"></param>
    /// <param name="places"></param>
    /// <returns>(source, target, allPlaces)</returns>
    private static (SolverPlace, SolverPlace, SortedSet<SolverPlace>) GetSolverPlaces(int sourceCat, int targetCat, IEnumerable<Place> places)
    {
        var solverSource = default(SolverPlace);
        var solverTarget = default(SolverPlace);

        var solverPlaces = places
            .Select((place, index) => (place, index))
            .Aggregate(new SortedSet<SolverPlace>(SolverPlaceComparer.Instance), (acc, item) =>
            {
                foreach (var cat in item.place.categories)
                {
                    SolverPlace solverPlace = new(item.index, cat);
                    _ = acc.Add(solverPlace);

                    if (cat == sourceCat) { solverSource = solverPlace; }
                    if (cat == targetCat) { solverTarget = solverPlace; }
                }
                return acc;
            });

        return (solverSource, solverTarget, solverPlaces);
    }

    /// <summary>
    /// Plan simple path through a given sequence.
    /// </summary>
    /// <param name="fullSeq">Sequence of places with terminal points.</param>
    /// <param name="places"></param>
    /// <param name="maxDistance"></param>
    /// <returns>A path or nothing.</returns>
    private async Task<ShortestPath> GetPath(IEnumerable<SolverPlace> fullSeq, List<Place> places, double maxDistance)
    {
        return (await _routingEngine.GetShortestPaths(fullSeq.Select((sp) => places[sp.idx].location).ToList()))
            .Where((p) => p.distance <= maxDistance)
            .FirstOrDefault();
    }

    /// <summary>
    /// Construct a route out of a path and a sequence of places excluding source and target.
    /// </summary>
    /// <param name="trimmedSeq"></param>
    /// <param name="places"></param>
    /// <param name="path"></param>
    /// <returns></returns>
    private static Route GetRoute(List<SolverPlace> trimmedSeq, List<Place> places, ShortestPath path)
    {
        var routePlaces = trimmedSeq.Aggregate(new List<Place>(), (acc, sp) =>
        {
            var place = places[sp.idx];

            acc.Add(new()
            {
                smartId = place.smartId,
                name = place.name,
                location = place.location,
                keywords = place.keywords,
                categories = new() { sp.cat } // add category!
            });
            return acc;
        })
        .WithMergedCategories();

        var routeWaypoints = trimmedSeq.Aggregate(new List<Waypoint>(), (acc, sp) =>
        {
            acc.Add(new(places[sp.idx].smartId, sp.cat));
            return acc;
        });

        return new() { path = path, places = routePlaces, waypoints = routeWaypoints };
    }

    public SearchRoutesHandler(IEntityIndex entityIndex, IRoutingEngine routingEngine)
    {
        _entityIndex = entityIndex; _routingEngine = routingEngine;
    }

    public async Task<List<Route>> Handle(SearchRoutesQuery query)
    {
        var result = new List<Route>();

        var source = query.source;
        var target = query.target;
        var arrows = query.arrows;
        var categories = query.categories;

        var sourceCat = categories.Count + 0;
        var targetCat = categories.Count + 1;
        var catsCount = categories.Count + 2;

        var sourceEs = GetSourceEs(sourceCat, catsCount);
        var targetEs = GetTargetEs(targetCat, catsCount);

        var precMatrix = SolverFactory
            .GetPrecedenceMatrix(arrows.Concat(sourceEs).Concat(targetEs), catsCount, arrows.Count > 0);

        var ellipse = Spherical.BoundingEllipse(source, target, query.maxDistance);

        var places = new List<Place>()
            .Concat(await _entityIndex.GetWithin(ellipse, categories))
            .Concat(new[] { new Place() { location = source, categories = new() { sourceCat } } })
            .Concat(new[] { new Place() { location = target, categories = new() { targetCat } } })
            .ToList();

        var distMatrix = new HaversineDistanceMatrix(places);

        var (solverSource, solverTarget, solverPlaces) = GetSolverPlaces(sourceCat, targetCat, places);

        var watch = Stopwatch.StartNew();
        do
        {
            var fullSeq = SolverFactory.GetSolver()
                .Solve(solverSource, solverTarget, solverPlaces, distMatrix, precMatrix);

            // only waypoints
            var trimmedSeq = fullSeq.Skip(1).SkipLast(1).ToList();

            // no candidates left
            if (trimmedSeq.Count < categories.Count) { break; }

            var path = await GetPath(fullSeq /* with st! */, places, query.maxDistance);

            if (path is not null)
            {
                result.Add(GetRoute(trimmedSeq /* without st! */, places, path));
            }

            trimmedSeq.ForEach((p) => { _ = solverPlaces.Remove(p); });
        } while (watch.ElapsedMilliseconds < ROUTE_CALCULATION_TIME_LIMIT_MS);

        result.Sort(RouteComparer.Instance);
        return result;
    }
}
