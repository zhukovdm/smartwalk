using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SmartWalk.Core.Algorithms;
using SmartWalk.Core.Solvers;
using SmartWalk.Domain.Entities;
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

        var places = new List<Place>()
            .Concat(await entityIndex.GetWithin(ellipse, categories))
            .Concat(new[] { new Place() { location = source, categories = new() { categories.Count + 0 } } })
            .Concat(new[] { new Place() { location = target, categories = new() { categories.Count + 1 } } })
            .ToList();

        var precMatrix = SolverFactory
            .GetPrecedenceMatrix(categories.Count, precedence);

        while (true)
        {
            var solverPlaces = places
                .Select((p, i) => (p, i))
                .Aggregate(new List<SolverPlace>(), (acc, itm) =>
                {
                    foreach (var cat in itm.p.categories)
                    {
                        acc.Add(new(itm.i, cat));
                    }
                    return acc;
                });

            var distMatrix = new HaversineDistanceMatrix(places);

            var seq = SolverFactory.GetSolver()
                .Solve(solverPlaces, distMatrix, precMatrix);

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
                    acc.Add(new()
                    {
                        smartId = p.smartId, name = p.name, location = p.location, keywords = p.keywords, categories = new() { sp.cat }
                    });
                    return acc;
                })
                .WithMergedCategories();

                var routeWaypoints = trimmedSeq.Aggregate(new List<string>(), (acc, sp) =>
                {
                    acc.Add(places[sp.idx].smartId);
                    return acc;
                });

                result.Add(new() { path = path, places = routePlaces, waypoints = routeWaypoints });
            }

            trimmedSeq.ForEach((p) => places[p.idx].categories.Remove(p.cat));
        }

        result.Sort(new RouteComparer());
        return result;
    }

    #endregion
}
