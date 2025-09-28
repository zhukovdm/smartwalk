using System.Collections.Generic;
using System.Threading.Tasks;
using SmartWalk.Core.Entities;
using SmartWalk.Application.Interfaces;
using System;

namespace SmartWalk.Infrastructure.Dummy;

public sealed class DummyShortestPathFinder : IShortestPathFinder
{
    public DummyShortestPathFinder() { }

    /// <summary>
    /// Find dummy shortest paths.
    /// </summary>
    /// <param name="waypoints">List of WGS84 points.</param>
    /// <returns>An empty list of shortest paths.</returns>
    public async Task<List<ShortestPath>> Search(IReadOnlyList<WgsPoint> waypoints)
    {
        return await Task.FromResult(instance.Value);
    }

    private static readonly Lazy<List<ShortestPath>> instance = new(() => new());
}
