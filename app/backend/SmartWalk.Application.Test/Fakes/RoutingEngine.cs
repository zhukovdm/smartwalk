using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using SmartWalk.Core.Entities;
using SmartWalk.Core.Interfaces;

namespace SmartWalk.Application.Test;

internal abstract class FakeRoutingEngine : IRoutingEngine
{
    protected double distance = 0.0;

    protected abstract int Delay { get; }

    public Task<IDistanceMatrix> GetDistanceMatrix(IReadOnlyList<WgsPoint> waypoints)
    {
        throw new NotImplementedException();
    }

    public Task<List<ShortestPath>> GetShortestPaths(IReadOnlyList<WgsPoint> waypoints)
    {
        var routes = new List<ShortestPath>()
        {
            new() { distance = distance, duration = 0.0, polyline = waypoints },
            new() { distance = distance, duration = 0.0, polyline = waypoints },
            new() { distance = distance, duration = 0.0, polyline = waypoints }
        };
        return Task.Delay(Delay).ContinueWith(_ => routes);
    }
}

internal sealed class FakeFastRoutingEngine : FakeRoutingEngine, IRoutingEngine
{
    protected override int Delay => 0;
}

internal sealed class FakeSlowRoutingEngine : FakeRoutingEngine, IRoutingEngine
{
    protected override int Delay => 2_000;
}

internal sealed class FakeDistanceRoutingEngine : FakeRoutingEngine
{
    protected override int Delay => 0;

    public FakeDistanceRoutingEngine(double distance) { this.distance = distance; }
}
