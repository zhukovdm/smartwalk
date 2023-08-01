using System.Net.Http;
using System.Threading.Tasks;

namespace SmartWalk.Services.RoutingEngine.Osrm;

internal static class QueryExecutor
{
    /// <summary>
    /// Executor of OSRM queries.
    /// </summary>
    /// <param name="query">well-formed query</param>
    /// <returns>Response body</returns>
    public static async Task<string> Execute(string query)
    {
        HttpResponseMessage res = await new HttpClient().GetAsync(query);
        return (res.IsSuccessStatusCode) ? await res.Content.ReadAsStringAsync() : null;
    }
}
