using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using GeoJSON.Text.Geometry;
using SmartWalk.Domain.Entities;

namespace SmartWalk.Infrastructure.RoutingEngine.Osrm;

internal static class ShortestPathFetcher
{
    private sealed class Route
    {
        /// <summary>
        /// Distance of a route in <b>meters</b>.
        /// </summary>
        public double distance { get; init; }

        /// <summary>
        /// Duration of a route in <b>seconds</b>.
        /// </summary>
        public double duration { get; init; }

        /// <summary>
        /// Shape of a route as GeoJSON object.
        /// </summary>
        public LineString geometry { get; init; }
    }

    private sealed class Answer
    {
        public string code { get; init; }

        public List<Route> routes { get; init; }
    }

    private sealed class PathComparer : IComparer<ShortestPath>
    {
        public int Compare(ShortestPath l, ShortestPath r) => l.distance.CompareTo(r.distance);
    }

    /// <summary>
    /// Request the traversal and the distance of the shortest path from an OSRM instance.
    /// <list>
    /// <item>http://project-osrm.org/docs/v5.24.0/api/#responses</item>
    /// <item>http://project-osrm.org/docs/v5.24.0/api/#route-service</item>
    /// </list>
    /// </summary>
    /// <param name="addr">Base URL of the service</param>
    /// <param name="waypoints">List of WGS 84 points</param>
    /// <returns>Non-null list of shortest paths.</returns>
    public static async Task<List<ShortestPath>> Fetch(string addr, List<WgsPoint> waypoints)
    {
        var res = await QueryExecutor.Execute(QueryConstructor.Route(addr, waypoints));
        if (res is null) { return new(); }

        var ans = JsonSerializer.Deserialize<Answer>(res);
        if (ans.code != "Ok") { return new(); }

        var paths = ans.routes.Select(r => new ShortestPath()
        {
            distance = r.distance,
            duration = r.duration,
            polyline = r.geometry.Coordinates
                .Select(p => new WgsPoint(p.Longitude, p.Latitude))
                .ToList()
        }).ToList();

        paths.Sort(new PathComparer());
        return paths;
    }
}
