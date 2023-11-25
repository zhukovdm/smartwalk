using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using SmartWalk.Core.Entities;
using SmartWalk.Core.Interfaces;
using SmartWalk.Infrastructure.RoutingEngine.Osrm;

namespace SmartWalk.Infrastructure.RoutingEngine;

public sealed class OsrmRoutingEngine : IRoutingEngine
{
    private readonly string baseUrl;

    private OsrmRoutingEngine(string baseUrl) { this.baseUrl = baseUrl; }

    public Task<IDistanceFunction> GetDistanceFunction(IReadOnlyList<WgsPoint> waypoints)
    {
        return OsrmDistanceFunctionQueryExecutor.Execute(new OsrmTableFetcher(baseUrl), waypoints);
    }

    public Task<List<ShortestPath>> GetShortestPaths(IReadOnlyList<WgsPoint> waypoints)
    {
        return OsrmShortestPathQueryExecutor.Execute(new OsrmRouteFetcher(baseUrl), waypoints);
    }

    public static IRoutingEngine GetInstance()
    {
        var baseUrl = Environment.GetEnvironmentVariable("SMARTWALK_OSRM_BASE_URL");
        return new OsrmRoutingEngine(baseUrl);
    }
}
