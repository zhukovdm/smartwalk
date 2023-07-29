using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace osm;

internal class Sophox
{
    private readonly Dictionary<long, Point> _rels;

    public Sophox(Dictionary<long, Point> rels) { _rels = rels; }

    public bool TryGetLocation(long id, out Point location) => _rels.TryGetValue(id, out location);
}

internal static class SophoxFactory
{
    private class Value
    {
        public string value { get; set; }
    }

    private class Entity
    {
        public Value oid { get; set; }

        public Value loc { get; set; }
    }

    private class Results
    {
        public List<Entity> bindings { get; set; }
    }

    private class Response
    {
        public Results results { get; set; }
    }

    private static string queryBuilder((double, double, double, double) bbox) {
        var (w, n, e, s) = bbox;
        return $@"PREFIX bd: <http://www.bigdata.com/rdf#>
PREFIX geo: <http://www.opengis.net/ont/geosparql#>
PREFIX osmm: <https://www.openstreetmap.org/meta/>
PREFIX osmt: <https://wiki.openstreetmap.org/wiki/Key:>
PREFIX wikibase: <http://wikiba.se/ontology#>
SELECT ?oid ?loc WHERE {{
  ?oid osmm:type 'r';
    osmt:type 'multipolygon'.
  SERVICE wikibase:box {{
    ?oid osmm:loc ?loc.
    bd:serviceParam wikibase:cornerSouthWest 'POINT({w} {s})'^^geo:wktLiteral.
    bd:serviceParam wikibase:cornerNorthEast 'POINT({e} {n})'^^geo:wktLiteral.
  }}
}}";
    }

    private static async Task<Response> fetch(ILogger logger, string link, List<string> bbox)
    {
        logger.LogInformation("Trying to contact {0} endpoint.", link);
        var url = $@"{link}?query={Uri.EscapeDataString(queryBuilder(Converter.ToBbox(bbox)))}";

        var cli = new HttpClient();
        cli.Timeout = TimeSpan.FromMinutes(10);
        cli.DefaultRequestHeaders.Add("Accept", "application/sparql-results+json;charset=utf-8");

        var res = await cli.GetAsync(url);
        var txt = await res.Content.ReadAsStringAsync();

        var jsn = JsonSerializer.Deserialize<Response>(txt);
        logger.LogInformation("Fetched {0} entities from Sophox.", jsn.results.bindings.Count);

        return jsn;
    }

    private static Dictionary<long, Point> extract(ILogger logger, Response obj)
    {
        var dic = new Dictionary<long, Point>();
        var rid = new Regex(@"^https://www.openstreetmap.org/relation/(?<oid>\d+)$", RegexOptions.IgnoreCase);
        var rpt = new Regex(@"^POINT\((?<lon>-?\d+(\.\d+)?) (?<lat>-?\d+(\.\d+)?)\)$", RegexOptions.IgnoreCase);

        foreach (var itm in obj.results.bindings)
        {
            var mid = rid.Match(itm.oid.value);
            var mpt = rpt.Match(itm.loc.value);

            if (!mid.Success || !mpt.Success) { continue; }

            var id = long.Parse(mid.Groups["oid"].Value);

            var pt = new Point()
            {
                lon = double.Parse(mpt.Groups["lon"].Value),
                lat = double.Parse(mpt.Groups["lat"].Value)
            };

            dic[id] = pt;
        }
        logger.LogInformation("Extracted {0} valid locations.", dic.Count);
        return dic;
    }

    public static async Task<Sophox> GetInstance(ILogger logger, string link, List<string> bbox)
    {
        return new(extract(logger, await fetch(logger, link, bbox)));
    }
}
