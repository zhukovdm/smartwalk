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

    public static async Task<ShortestPath> GetDirecs(IRoutingEngine routingEngine, List<WgsPoint> waypoints)
    {
        return (await routingEngine.GetShortestPaths(waypoints)).FirstOrDefault();
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
        IEntityIndex entityIndex, IGeoIndex geoIndex, IRoutingEngine routingEngine,
        WgsPoint source, WgsPoint target, double maxDistance, List<Category> categories, List<PrecedenceEdge> precedence)
    {
        var result = new List<Route>();

        var ellipse = Spherical.BoundingEllipse(source, target, maxDistance);

        var places = new List<Place>()
            .Concat(new[] { new Place() { location = source, categories = new() { -1 } } })
            .Concat(await entityIndex.GetWithin(ellipse, categories))
            .Concat(new[] { new Place() { location = target, categories = new() { -1 } } })
            .ToList();

        var detourRatio = await geoIndex.GetDetourRatio(ellipse);

        while (places.Count > 2)
        {
            var solverPlaces = places
                .Select((p, i) => (p, i))
                .Aggregate(new List<SolverPlace>(), (acc, itm) =>
                {
                    foreach (var category in itm.p.categories)
                    {
                        acc.Add(new(itm.i, category));
                    }
                    return acc;
                });

            var matrix = new HaversineDistanceMatrix(places, detourRatio);

            var seq = SolverFactory.GetInstance().Solve(solverPlaces, matrix, precedence);

            var path = (await routingEngine.GetShortestPaths(seq.Select((sp) => places[sp.Idx].location).ToList()))
                .Where((p) => p.distance <= maxDistance)
                .FirstOrDefault();

            var trimmedSeq = seq.Skip(1).SkipLast(1).ToList();

            if (trimmedSeq.Count == categories.Count && path is not null)
            {
                var routePlaces = trimmedSeq.Aggregate(new List<Place>(), (acc, sp) =>
                {
                    var p = places[sp.Idx];
                    acc.Add(new()
                    {
                        smartId = p.smartId, name = p.name, location = p.location, keywords = p.keywords, categories = new() { sp.Cat }
                    });
                    return acc;
                })
                .WithMergedCategories();

                var routeWaypoints = trimmedSeq.Aggregate(new List<string>(), (acc, sp) =>
                {
                    acc.Add(places[sp.Idx].smartId);
                    return acc;
                });

                result.Add(new() { path = path, places = routePlaces, waypoints = routeWaypoints });
            }

            trimmedSeq.ForEach((p) => places[p.Idx].categories.Remove(p.Cat));
            places = places.Where((p) => p.categories.Count > 0).ToList();
        }

        result.Sort(new RouteComparer());
        return result;
    }

    #endregion
}
