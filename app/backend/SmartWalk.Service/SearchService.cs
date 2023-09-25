using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SmartWalk.Core.Algorithms;
using SmartWalk.Core.Solvers;
using SmartWalk.Domain.Entities;
using SmartWalk.Domain.Extensions;
using SmartWalk.Domain.Interfaces;

namespace SmartWalk.Service;

public static class SearchService
{
    #region Direcs

    public static Task<List<ShortestPath>> GetDirecs(IRoutingEngine routingEngine, List<WgsPoint> waypoints)
    {
        return routingEngine.GetShortestPaths(waypoints);
    }

    #endregion

    #region Places

    public static async Task<List<Place>> GetPlaces(
        IEntityIndex entityIndex, WgsPoint center, double radius, List<Category> categories)
    {
        return await entityIndex.GetAround(center, radius, categories);
    }

    #endregion

    #region Routes

    /// <summary>
    /// Time span dedicated to route calculation (in milliseconds).
    /// </summary>
    private static readonly int ROUTE_CALCULATION_TIME_LIMIT_MS = 1_000;

    private sealed class SolverPlaceComparer : IComparer<SolverPlace>
    {
        public int Compare(SolverPlace l, SolverPlace r)
            => (l.idx != r.idx) ? l.idx.CompareTo(r.idx) : l.cat.CompareTo(r.cat);
    }

    private sealed class RouteComparer : IComparer<Route>
    {
        public int Compare(Route l, Route r) => l.path.distance.CompareTo(r.path.distance);
    }

    public async static Task<List<Route>> GetRoutes(
        IEntityIndex entityIndex, IRoutingEngine routingEngine, WgsPoint source, WgsPoint target,
        double maxDistance, List<Category> categories, List<PrecedenceEdge> precedence)
    {
        var result = new List<Route>();

        var ellipse = Spherical.BoundingEllipse(source, target, maxDistance);

        var sourceCat = categories.Count + 0;
        var targetCat = categories.Count + 1;

        var totalCats = categories.Count + 2;

        var places = new List<Place>()
            .Concat(await entityIndex.GetWithin(ellipse, categories))
            .Concat(new[] { new Place() { location = source, categories = new() { sourceCat } } })
            .Concat(new[] { new Place() { location = target, categories = new() { targetCat } } })
            .ToList();

        // source before all (no loops!)

        var sourceEs = from to in Enumerable.Range(0, totalCats)
                       where to != sourceCat
                       select new PrecedenceEdge(sourceCat, to);

        // all before target (no loops!)

        var targetEs = from fr in Enumerable.Range(0, totalCats)
                       where fr != targetCat
                       select new PrecedenceEdge(fr, targetCat);

        var precMatrix = SolverFactory
            .GetPrecedenceMatrix(precedence.Concat(sourceEs).Concat(targetEs), totalCats, precedence.Count == 0);

        var distMatrix = new HaversineDistanceMatrix(places);

        var solverSource = default(SolverPlace);
        var solverTarget = default(SolverPlace);

        var solverPlaces = places
            .Select((p, i) => (p, i))
            .Aggregate(new SortedSet<SolverPlace>(new SolverPlaceComparer()), (acc, itm) =>
            {
                foreach (var cat in itm.p.categories)
                {
                    SolverPlace place = new(itm.i, cat);
                    _ = acc.Add(place);

                    if (cat == sourceCat) { solverSource = place; }
                    if (cat == targetCat) { solverTarget = place; }
                }
                return acc;
            });

        var startedAt = DateTime.Now;
        do
        {
            var seq = SolverFactory.GetSolver()
                .Solve(solverSource, solverTarget, solverPlaces, distMatrix, precMatrix);

            var trimmedSeq = seq.Skip(1).SkipLast(1).ToList();

            if (trimmedSeq.Count < categories.Count) { break; } // no candidates left

            var path = (await routingEngine.GetShortestPaths(seq.Select((sp) => places[sp.idx].location).ToList()))
                .Where((p) => p.distance <= maxDistance)
                .FirstOrDefault();

            if (path is not null)
            {
                var routePlaces = trimmedSeq.Aggregate(new List<Place>(), (acc, sp) =>
                {
                    var p = places[sp.idx];

                    // ensure only satisfied categories!
                    acc.Add(new()
                    {
                        smartId = p.smartId,
                        name = p.name,
                        location = p.location,
                        keywords = p.keywords,
                        categories = new() { sp.cat }
                    });
                    return acc;
                })
                .WithMergedCategories();

                var routeWaypoints = trimmedSeq.Aggregate(new List<Waypoint>(), (acc, sp) =>
                {
                    acc.Add(new(places[sp.idx].smartId, sp.cat));
                    return acc;
                });

                result.Add(new() { path = path, places = routePlaces, waypoints = routeWaypoints });
            }

            trimmedSeq.ForEach((p) => { _ = solverPlaces.Remove(p); });
        } while ((DateTime.Now - startedAt).TotalMilliseconds < ROUTE_CALCULATION_TIME_LIMIT_MS);

        result.Sort(new RouteComparer());
        return result;
    }

    #endregion
}
