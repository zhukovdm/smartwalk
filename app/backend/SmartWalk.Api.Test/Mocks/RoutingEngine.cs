using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using SmartWalk.Model.Entities;
using SmartWalk.Model.Interfaces;

namespace SmartWalk.Api.Test.Mocks;

internal sealed class FakeWorkingRoutingEngine : IRoutingEngine
{
    public Task<IDistanceMatrix> GetDistanceMatrix(IReadOnlyList<WgsPoint> waypoints)
        => throw new NotImplementedException();

    public Task<List<ShortestPath>> GetShortestPaths(IReadOnlyList<WgsPoint> waypoints)
    {
        var paths = new List<ShortestPath>()
        {
            new() { distance = 0.0, duration = 0.0, polyline = waypoints }
        };
        return Task.FromResult(paths);
    }
}

internal sealed class FakeFailingRoutingEngine : IRoutingEngine
{
    public Task<IDistanceMatrix> GetDistanceMatrix(IReadOnlyList<WgsPoint> waypoints)
        => throw new Exception($"{this.GetType()}: GetDistanceMatrix");

    public Task<List<ShortestPath>> GetShortestPaths(IReadOnlyList<WgsPoint> waypoints)
        => throw new Exception($"{this.GetType()}: GetShortestPaths");
}
