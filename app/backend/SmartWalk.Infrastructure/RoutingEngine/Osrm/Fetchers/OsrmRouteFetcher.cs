using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json;
using System.Threading.Tasks;
using SmartWalk.Core.Entities;

namespace SmartWalk.Infrastructure.RoutingEngine.Osrm;

internal sealed class OsrmRouteFetcher : OsrmFetcherBase, IOsrmRouteFetcher
{
    private sealed class OsrmRouteResponse
    {
        [Required]
        public string code { get; init; }

        [Required]
        public List<OsrmRoute> routes { get; init; }
    }

    /// <summary>
    /// Construct URL for a path fetch.
    /// </summary>
    private string GetUrl(IEnumerable<WgsPoint> waypoints)
    {
        return baseUrl + "/route/v1/foot/" + Chain(waypoints) + "?alternatives=true&geometries=geojson&skip_waypoints=true";
    }

    public OsrmRouteFetcher(string baseUrl) : base(baseUrl) { }

    public async Task<List<OsrmRoute>> Fetch(IEnumerable<WgsPoint> waypoints)
    {
        var content = await MakeHttpRequest(GetUrl(waypoints));
        if (content is null) { return new(); }

        var response = JsonSerializer.Deserialize<OsrmRouteResponse>(content);

        return (response.code == "Ok") ? response.routes : new();
    }
}
