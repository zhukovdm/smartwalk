using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using SmartWalk.Model.Entities;

namespace SmartWalk.Infrastructure.RoutingEngine.Osrm;

internal abstract class OsrmFetcherBase
{
    protected readonly string _baseUrl;

    protected OsrmFetcherBase(string baseUrl) { _baseUrl = baseUrl; }

    protected string Chain(IEnumerable<WgsPoint> waypoints)
    {
        return string.Join(';', waypoints.Select(w => w.lon.ToString() + ',' + w.lat.ToString()));
    }

    /// <summary>
    /// <list>
    /// <item>http://project-osrm.org/docs/v5.24.0/api/#responses</item>
    /// </list>
    /// </summary>
    /// <returns>Response content</returns>
    protected async Task<string> MakeHttpRequest(string url)
    {
        var response = await new HttpClient().GetAsync(url);
        return (response.IsSuccessStatusCode) ? await response.Content.ReadAsStringAsync() : null;
    }
}
