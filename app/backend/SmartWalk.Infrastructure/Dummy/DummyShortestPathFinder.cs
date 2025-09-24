using System.Collections.Generic;
using System.Threading.Tasks;
using SmartWalk.Core.Entities;
using SmartWalk.Application.Interfaces;
using System.Linq;
using SmartWalk.Core.Algorithms;

namespace SmartWalk.Infrastructure.Dummy;

public sealed class DummyShortestPathFinder : IShortestPathFinder
{
    public DummyShortestPathFinder() { }

    /// <summary>
    /// Find dummy shortest paths.
    /// </summary>
    /// <param name="waypoints">List of WGS84 points</param>
    /// <returns>A list with exactly one item</returns>
    public async Task<List<ShortestPath>> Search(IReadOnlyList<WgsPoint> waypoints)
    {
        var distance = waypoints.Zip(waypoints.Skip(1))
            .Aggregate(0.0, (acc, tup) => acc + Spherical.HaversineDistance(tup.First, tup.Second));

        return await Task.FromResult<List<ShortestPath>>(new()
        {
            new() { distance = distance, duration = default, polyline = default }
        });
    }
}
