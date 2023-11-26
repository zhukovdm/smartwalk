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
    private readonly IEntityIndex entityIndex;
    private readonly IRoutingEngine routingEngine;

    /// <summary>
    /// Time span dedicated to route calculation (in milliseconds).
    /// </summary>
    private static readonly int ROUTE_CALCULATION_TIME_LIMIT_MS = 1_000;

    private sealed class SolverPlaceComparer : IComparer<SolverPlace>
    {
        private SolverPlaceComparer() { }

        private static readonly Lazy<SolverPlaceComparer> instance = new(() => new());

        public static SolverPlaceComparer Instance { get { return instance.Value; } }

        public int Compare(SolverPlace l, SolverPlace r)
        {
            return (l.idx != r.idx) ? l.idx.CompareTo(r.idx) : l.cat.CompareTo(r.cat);
        }
    }

    private sealed class RouteComparer : IComparer<Route>
    {
        private RouteComparer() { }

        private static readonly Lazy<RouteComparer> instance = new(() => new());

        public static RouteComparer Instance { get { return instance.Value; } }

        public int Compare(Route l, Route r)
        {
            return l.path.distance.CompareTo(r.path.distance);
        }
    }

    /// <summary>
    /// Expand places into disjunct solver places.
    /// </summary>
    /// <param name="sourceCat">CategoryId of the source point.</param>
    /// <param name="targetCat">CategoryId of the target point.</param>
    /// <param name="places">Places from the index.</param>
    /// <returns>Places in a solver format.</returns>
    private static (SolverPlace, SolverPlace, SortedSet<SolverPlace>) GetSolverPlaces(IEnumerable<Place> places, int sourceCat, int targetCat)
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

                    if (cat != sourceCat && cat != targetCat)
                    {
                        _ = acc.Add(solverPlace);
                    }

                    if (cat == sourceCat)
                    {
                        solverSource = solverPlace;
                    }

                    if (cat == targetCat)
                    {
                        solverTarget = solverPlace;
                    }
                }
                return acc;
            });

        return (solverSource, solverTarget, solverPlaces);
    }

    /// <summary>
    /// Plan simple path through a given sequence.
    /// </summary>
    /// <param name="fullSeq">Sequence of places with terminal points.</param>
    /// <param name="places">Places from the index.</param>
    /// <param name="maxDistance">Maximum allowed distance of a route.</param>
    /// <returns>A path or nothing.</returns>
    private async Task<ShortestPath> GetPath(IEnumerable<SolverPlace> fullSeq, List<Place> places, double maxDistance)
    {
        return (await routingEngine.GetShortestPaths(fullSeq.Select((sp) => places[sp.idx].location).ToList()))
            .Where((p) => p.distance <= maxDistance)
            .FirstOrDefault();
    }

    /// <summary>
    /// Construct a route out of a path and a sequence of places excluding source and target.
    /// </summary>
    /// <param name="trimmedSeq">Route sequence excluding source and target locations.</param>
    /// <param name="places">All places.</param>
    /// <param name="path">Exact route traversal.</param>
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
        this.entityIndex = entityIndex; this.routingEngine = routingEngine;
    }

    public async Task<List<Route>> Handle(SearchRoutesQuery query)
    {
        var result = new List<Route>();

        var categories = query.categories;

        var sourceCat = categories.Count + 0;
        var targetCat = categories.Count + 1;

        var source = new Place() { location = query.source, categories = new() { sourceCat } };
        var target = new Place() { location = query.target, categories = new() { targetCat } };

        var ellipse = Spherical.BoundingEllipse(source.location, target.location, query.maxDistance);

        var places = new List<Place>()
            .Concat(await entityIndex.GetWithin(ellipse, categories))
            .Concat(new[] { source })
            .Concat(new[] { target })
            .ToList();

        var distFn = new HaversineDistanceFunction(places);
        var (solverSource, solverTarget, solverPlaces) = GetSolverPlaces(places, sourceCat, targetCat);

        var factory = new SolverFactory(distFn, query.arrows, solverSource, solverTarget);

        var watch = Stopwatch.StartNew();
        do
        {
            var fullSeq = factory.GetSolver().Solve(solverPlaces);

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
