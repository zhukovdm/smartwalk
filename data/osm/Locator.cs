using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace osm;

internal class Locator
{
    private readonly Dictionary<long, Point> _locs;

    public Locator(Dictionary<long, Point> locs) { _locs = locs; }

    public bool TryGetLocation(long id, out Point location) => _locs.TryGetValue(id, out location);
}

internal static class OverpassLocatorFactory
{
    private class Element
    {
        public long id { get; set; }

        public Point center { get; set; }
    }

    private class Response
    {
        public List<Element> elements { get; set; }
    }

    private static async Task<Response> Fetch(ILogger logger, List<string> bbox)
    {
        logger.LogInformation("Trying to contact Overpass endpoint.");

        var (w, n, e, s) = Converter.ToBbox(bbox);
        var url = $"https://overpass-api.de/api/interpreter?data=[out:json];relation({s},{w},{n},{e})[type=multipolygon];out%20center;";

        var res = await new HttpClient().GetAsync(url);
        var txt = await res.Content.ReadAsStringAsync();

        var jsn = JsonSerializer.Deserialize<Response>(txt);
        logger.LogInformation("Fetched {0} entities from Overpass.", jsn.elements.Count);

        return jsn;
    }

    private static Dictionary<long, Point> Extract(ILogger logger, Response obj)
    {
        var dic = new Dictionary<long, Point>();

        foreach (var element in obj.elements)
        {
            dic[element.id] = element.center;
        }
        return dic;
    }

    public static async Task<Locator> GetInstance(ILogger logger, List<string> bbox)
    {
        return new(Extract(logger, await Fetch(logger, bbox)));
    }
}

internal static class SophoxLocatorFactory
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

    private static string QueryBuilder((double, double, double, double) bbox)
    {
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
    bd:serviceParam wikibase:cornerSouthWest 'Point({w} {s})'^^geo:wktLiteral.
    bd:serviceParam wikibase:cornerNorthEast 'Point({e} {n})'^^geo:wktLiteral.
  }}
}}";
    }

    private static async Task<Response> Fetch(ILogger logger, List<string> bbox)
    {
        logger.LogInformation("Trying to contact Sophox endpoint.");
        var url = $"https://sophox.org/sparql?query={Uri.EscapeDataString(QueryBuilder(Converter.ToBbox(bbox)))}";

        var cli = new HttpClient();
        cli.Timeout = TimeSpan.FromMinutes(10);
        cli.DefaultRequestHeaders.Add("Accept", "application/sparql-results+json;charset=utf-8");

        var res = await cli.GetAsync(url);
        var txt = await res.Content.ReadAsStringAsync();

        var jsn = JsonSerializer.Deserialize<Response>(txt);
        logger.LogInformation("Fetched {0} entities from Sophox.", jsn.results.bindings.Count);

        return jsn;
    }

    private static Dictionary<long, Point> Extract(ILogger logger, Response obj)
    {
        var dic = new Dictionary<long, Point>();
        var rid = new Regex(@"^https://www.openstreetmap.org/relation/(?<oid>\d+)$", RegexOptions.IgnoreCase);
        var rpt = new Regex(@"^Point\((?<lon>-?\d+(\.\d+)?) (?<lat>-?\d+(\.\d+)?)\)$", RegexOptions.IgnoreCase);

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

    public static async Task<Locator> GetInstance(ILogger logger, List<string> bbox)
    {
        return new(Extract(logger, await Fetch(logger, bbox)));
    }
}

internal static class LocatorFactory
{
    public static Task<Locator> GetInstance(ILogger logger, List<string> bbox)
        => OverpassLocatorFactory.GetInstance(logger, bbox);
}
