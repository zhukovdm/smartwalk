using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SmartWalk.Model.Entities;

namespace SmartWalk.Infrastructure.RoutingEngine.Osrm;

internal static class OsrmShortestPathQueryExecutor
{
    private sealed class PathComparer : IComparer<ShortestPath>
    {
        public int Compare(ShortestPath l, ShortestPath r)
            => l.distance.CompareTo(r.distance);
    }

    /// <summary>
    /// Request the shortest paths from an OSRM instance.
    /// </summary>
    /// <param name="addr">Base URL of the service</param>
    /// <param name="waypoints">List of WGS 84 points</param>
    /// <returns>Non-null list of shortest paths ordered by distance.</returns>
    public static async Task<List<ShortestPath>> Execute(IOsrmRouteFetcher fetcher, IEnumerable<WgsPoint> waypoints)
    {
        var paths = (await fetcher.Fetch(waypoints)).Select(r => new ShortestPath()
        {
            distance = r.distance.Value,
            duration = r.duration.Value,
            polyline = r.geometry.Coordinates
                .Select(p => new WgsPoint(p.Longitude, p.Latitude))
                .ToList()
        }).ToList();

        paths.Sort(new PathComparer());
        return paths;
    }
}
