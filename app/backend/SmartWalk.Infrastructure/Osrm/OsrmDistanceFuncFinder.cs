using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using SmartWalk.Application.Interfaces;
using SmartWalk.Core.Entities;
using SmartWalk.Infrastructure.Osrm.Helpers;

namespace SmartWalk.Infrastructure.Osrm;

public sealed class OsrmDistanceFuncFinder : IDistanceFuncFinder
{
    private readonly OsrmHttpClient client;

    public OsrmDistanceFuncFinder(IHttpClientFactory factory)
    {
        client = new(factory);
    }

    /// <summary>
    /// Find all-pair shortest path distance table.
    /// </summary>
    /// <param name="waypoints">List of WGS84 points</param>
    /// <returns>Possibly null distance table</returns>
    public async Task<List<List<double>>> Search(IReadOnlyList<WgsPoint> waypoints)
    {
        var response = await client.GetTableResponse(waypoints);

        return (response?.code == "Ok") ? response.distances : null;
    }
}
