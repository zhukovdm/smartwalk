using System.Collections.Generic;
using System.Threading.Tasks;
using SmartWalk.Core.Entities;
using SmartWalk.Application.Interfaces;
using System.Linq;
using System.Net.Http;
using SmartWalk.Infrastructure.Osrm.Helpers;

namespace SmartWalk.Infrastructure.Osrm;

public sealed class OsrmShortestPathFinder : IShortestPathFinder
{
    private readonly OsrmHttpClient client;

    public OsrmShortestPathFinder(IHttpClientFactory factory)
    {
        client = new(factory);
    }

    /// <summary>
    /// Find shortest paths.
    /// </summary>
    /// <param name="waypoints">List of WGS84 points</param>
    /// <returns>Non-null list of shortest paths</returns>
    public async Task<List<ShortestPath>> Search(IReadOnlyList<WgsPoint> waypoints)
    {
        var response = await client.GetRouteResponse(waypoints);

        return (response?.code == "Ok")
            ? response.routes.Select(r =>
                new ShortestPath()
                {
                    distance = r.distance.Value,
                    duration = r.duration.Value,
                    polyline = r.geometry.Coordinates
                        .Select(p => new WgsPoint(p.Longitude, p.Latitude))
                        .ToList()
                }).ToList()
            : [];
    }
}
