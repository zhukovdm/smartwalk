using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using SmartWalk.Application.Interfaces;
using SmartWalk.Core.Entities;
using SmartWalk.Core.Interfaces;

namespace SmartWalk.Api.Test.Fakes;

internal sealed class FakeWorkingShortestPathFinder : IShortestPathFinder
{
    public Task<List<ShortestPath>> Search(IReadOnlyList<WgsPoint> waypoints)
    {
        var paths = new List<ShortestPath>()
        {
            new() { distance = 0.0, duration = 0.0, polyline = waypoints }
        };
        return Task.FromResult(paths);
    }
}

internal sealed class FakeFailingShortestPathFinder : IShortestPathFinder
{
    public Task<List<ShortestPath>> Search(IReadOnlyList<WgsPoint> waypoints)
    {
        throw new Exception($"{GetType()}: GetPaths");
    }
}
