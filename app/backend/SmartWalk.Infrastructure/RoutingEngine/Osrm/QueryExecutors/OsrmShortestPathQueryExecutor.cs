using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SmartWalk.Core.Entities;

namespace SmartWalk.Infrastructure.RoutingEngine.Osrm;

internal static class OsrmShortestPathQueryExecutor
{
    private sealed class PathComparer : IComparer<ShortestPath>
    {
        private PathComparer() { }

        private static readonly Lazy<PathComparer> _instance = new(() => new());

        public static PathComparer Instance { get { return _instance.Value; } }

        public int Compare(ShortestPath l, ShortestPath r)
            => l.distance.CompareTo(r.distance);
    }

    /// <summary>
    /// Request the shortest paths from an OSRM instance.
    /// </summary>
    /// <param name="fetcher">Primitive that makes HTTP request.</param>
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

        paths.Sort(PathComparer.Instance);
        return paths;
    }
}
