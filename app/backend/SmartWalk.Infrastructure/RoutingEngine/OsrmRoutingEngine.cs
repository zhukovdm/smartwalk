using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using SmartWalk.Infrastructure.RoutingEngine.Osrm;
using SmartWalk.Model.Entities;
using SmartWalk.Model.Interfaces;

namespace SmartWalk.Infrastructure.RoutingEngine;

public sealed class OsrmRoutingEngine : IRoutingEngine
{
    private readonly string _baseUrl;

    private OsrmRoutingEngine(string baseUrl) { _baseUrl = baseUrl; }

    public async Task<List<ShortestPath>> GetShortestPaths(IReadOnlyList<WgsPoint> waypoints)
        => await ShortestPathFetcher.Fetch(_baseUrl, waypoints);

    public async Task<IDistanceMatrix> GetDistanceMatrix(IReadOnlyList<WgsPoint> waypoints)
        => await DistanceMatrixFetcher.Fetch(_baseUrl, waypoints);

    public static IRoutingEngine GetInstance()
    {
        var baseUrl = Environment.GetEnvironmentVariable("SMARTWALK_OSRM_BASE_URL");
        return new OsrmRoutingEngine(baseUrl);
    }
}