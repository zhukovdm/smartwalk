using System.Collections.Generic;
using System.Threading.Tasks;
using SmartWalk.Domain.Entities;
using SmartWalk.Domain.Interfaces;
using SmartWalk.Infrastructure.RoutingEngine.Osrm;

namespace SmartWalk.Infrastructure.RoutingEngine;

internal sealed class OsrmRoutingEngine : IRoutingEngine
{
    private readonly string _addr;
    private OsrmRoutingEngine(string addr) { _addr = addr; }

    public async Task<List<ShortestPath>> GetShortestPath(List<WgsPoint> waypoints)
        => await ShortestPathFetcher.Fetch(_addr, waypoints);

    public async Task<IDistanceMatrix> GetDistanceMatrix(List<WgsPoint> waypoints)
        => await DistanceMatrixFetcher.Fetch(_addr, waypoints);

    public static IRoutingEngine GetInstance() => new OsrmRoutingEngine(OsrmPrimitives.BASE_URL);
}
