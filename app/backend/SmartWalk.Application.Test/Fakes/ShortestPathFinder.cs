using System.Collections.Generic;
using System.Threading.Tasks;
using SmartWalk.Application.Interfaces;
using SmartWalk.Core.Entities;

namespace SmartWalk.Application.Test;

internal abstract class FakeShortestPathFinderBase : IShortestPathFinder
{
    protected double distance = 0.0;

    protected abstract int Delay { get; }

    public Task<List<ShortestPath>> Search(IReadOnlyList<WgsPoint> waypoints)
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

internal sealed class FakeFastShortestPathFinder : FakeShortestPathFinderBase
{
    protected override int Delay => 0;
}

internal sealed class FakeSlowShortestPathFinder : FakeShortestPathFinderBase
{
    protected override int Delay => 2_000;
}

internal sealed class FakeLongShortestPathFinder : FakeShortestPathFinderBase
{
    protected override int Delay => 0;

    public FakeLongShortestPathFinder(double distance) { this.distance = distance; }
}
