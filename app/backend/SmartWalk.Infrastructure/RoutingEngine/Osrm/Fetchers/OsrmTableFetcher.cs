using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json;
using System.Threading.Tasks;
using SmartWalk.Core.Entities;

namespace SmartWalk.Infrastructure.RoutingEngine.Osrm;

using Table = List<List<double>>;

internal sealed class OsrmTableFetcher : OsrmFetcherBase, IOsrmTableFetcher
{
    private sealed class OsrmTableResponse
    {
        [Required]
        public string code { get; init; }

        [Required]
        public Table distances { get; init; }
    }

    private string GetUrl(IEnumerable<WgsPoint> waypoints)
    {
        return _baseUrl + "/table/v1/foot/" + Chain(waypoints) + "?annotations=distance&skip_waypoints=true";
    }

    public OsrmTableFetcher(string baseUrl) : base(baseUrl) { }

    public async Task<Table> Fetch(IEnumerable<WgsPoint> waypoints)
    {
        var content = await MakeHttpRequest(GetUrl(waypoints));
        if (content is null) { return null; }

        var response = JsonSerializer.Deserialize<OsrmTableResponse>(content);

        return (response.code == "Ok") ? response.distances : null;
    }
}
