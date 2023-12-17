using System.Collections.Generic;
using System.Threading.Tasks;
using SmartWalk.Core.Entities;
using SmartWalk.Infrastructure.RoutingEngine.Osrm;

namespace SmartWalk.Infrastructure.Test.Fakes;

internal sealed class FakeOsrmRouteFetcher : IOsrmRouteFetcher
{
    private readonly List<OsrmRoute> routes;

    public FakeOsrmRouteFetcher(List<OsrmRoute> routes) { this.routes = routes; }

    public Task<List<OsrmRoute>> Fetch(IEnumerable<WgsPoint> _)
    {
        return Task.FromResult(routes);
    }
}
