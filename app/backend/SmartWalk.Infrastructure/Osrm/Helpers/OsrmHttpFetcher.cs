using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using SmartWalk.Core.Entities;
using SmartWalk.Infrastructure.Osrm.Entities;

namespace SmartWalk.Infrastructure.Osrm.Helpers;

internal sealed class OsrmHttpClient
{
    public static readonly string baseUrl;

    private readonly IHttpClientFactory httpClientFactory;

    static OsrmHttpClient()
    {
        baseUrl = Environment.GetEnvironmentVariable("SMARTWALK_OSRM_BASE_URL");
    }

    public OsrmHttpClient(IHttpClientFactory httpClientFactory)
    {
        this.httpClientFactory = httpClientFactory;
    }

    public Task<OsrmRouteResponse> GetRouteResponse(IEnumerable<WgsPoint> waypoints)
    {
        return MakeHttpRequest<OsrmRouteResponse>(GetRouteUrl(waypoints));
    }

    /// <summary>
    /// <list type="bullet">
    /// <item>http://project-osrm.org/docs/v5.24.0/api/#route-service</item>
    /// </list>
    /// </summary>
    private static string GetRouteUrl(IEnumerable<WgsPoint> waypoints)
    {
        return baseUrl + "/route/v1/foot/" + Chain(waypoints) + "?alternatives=true&geometries=geojson&skip_waypoints=true";
    }

    /// <summary>
    /// <list type="bullet">
    /// <item>http://project-osrm.org/docs/v5.24.0/api/#responses</item>
    /// </list>
    /// </summary>
    private async Task<T> MakeHttpRequest<T>(string url) where T : class
    {
        var resp = await httpClientFactory.CreateClient().GetAsync(url);

        if (!resp.IsSuccessStatusCode) { return null; }

        var cont = await resp.Content.ReadAsStringAsync();

        return (cont is not null) ? JsonSerializer.Deserialize<T>(cont) : null;
    }

    private static string Chain(IEnumerable<WgsPoint> waypoints)
    {
        return string.Join(';', waypoints.Select(w => w.lon.ToString() + ',' + w.lat.ToString()));
    }
}
