using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using OsmSharp;

namespace osm;

/// <summary></summary>
internal class ElementLocator1(ILogger logger, int ncnt, int wcnt)
{
    internal readonly struct P(long id, (double lon, double lat) loc)
    {
        internal readonly long Id = id;
        internal readonly (double Lon, double Lat) Loc = loc;
    }

    internal readonly struct B
    {
        internal readonly long Id;

        internal readonly (double MinLon /*w*/, double MaxLat /*n*/, double MaxLon /*e*/, double MinLat /*s*/) Loc
                        = (double.MaxValue, double.MinValue, double.MinValue, double.MaxValue);

        internal B(long id, IEnumerable<Point> seq)
        {
            Id = id;

            foreach (var p in seq)
            {
                Loc.MinLon = Math.Min(Loc.MinLon, p.lon); /*w*/
                Loc.MaxLat = Math.Max(Loc.MaxLat, p.lat); /*n*/
                Loc.MaxLon = Math.Max(Loc.MaxLon, p.lon); /*e*/
                Loc.MinLat = Math.Min(Loc.MinLat, p.lat); /*s*/
            }
        }
    }

    private readonly ILogger logger = logger;

    private readonly List<P> ns = new(ncnt);
    private readonly List<B> bs = new(wcnt);

    private static readonly Comparer<P> ncomparer = Comparer<P>.Create((l, r) => l.Id.CompareTo(r.Id));
    private static readonly Comparer<B> wcomparer = Comparer<B>.Create((l, r) => l.Id.CompareTo(r.Id));

    /// <summary>
    /// Adds nodes with defined identifier, longitude, and latitude.
    /// </summary>
    private bool TryAddPointLocation(Node? node)
    {
        if (node is null) { return false; }

        // consider only well defined points, and skip otherwise
        if (node.Id is null || node.Longitude is null || node.Latitude is null || !CrsEpsg3857.IsWithin(node.Longitude.Value, node.Latitude.Value))
        {
            if (logger.IsEnabled(LogLevel.Information))
            {
                logger.LogInformation("node/{Id} is ill-defined.", node.Id);
            }
            return false;
        }

        ns.Add(new(node.Id.Value, new(node.Longitude.Value, node.Latitude.Value)));
        return true;
    }

    /// <summary>
    /// Search node by identifier, guaranteed to be a valid configuration if found.
    /// Note that sorting is due to sorting=Type_then_ID in PBF (data is presorted).
    /// </summary>
    public bool TryGetPointLocation(long nodeId, out P n)
    {
        var i = ns.BinarySearch(new(nodeId, default), ncomparer);
        n = i >= 0 ? ns[i] : default;

        return i >= 0;
    }

    public bool TryGetPointSequence(long[] nodes, out List<Point> sequence)
    {
        sequence = [];

        foreach (var nodeId in nodes)
        {
            if (!TryGetPointLocation(nodeId, out var n))
            {
                return false;
            }
            sequence.Add(new() { lon = n.Loc.Lon, lat = n.Loc.Lat });
        }

        return true;
    }

    /// <summary>
    /// Ways with bounding box are also valid ways.
    /// </summary>
    private bool TryAddWayBoundingBox(Way? way)
    {
        if (way is null) { return false; }

        // consider only well defined ways, and skip otherwise
        if (way.Id is null || way.Nodes is null || !TryGetPointSequence(way.Nodes, out var seq))
        {
            if (logger.IsEnabled(LogLevel.Information))
            {
                logger.LogInformation("way/{Id} is ill-defined.", way.Id);
            }
            return false;
        }

        // open ways are not considered
        if (way.Nodes.Length < 4 && way.Nodes[0] != way.Nodes[^1]) { return false; }

        bs.Add(new(way.Id.Value, seq));
        return true;
    }

    /// <summary>
    /// Ways with a bounding box have all parts and are closed.
    /// </summary>
    public bool TryGetWayBoundingBox(long wayId, out B b)
    {
        var i = bs.BinarySearch(new(wayId, []), wcomparer);
        b = i >= 0 ? bs[i] : default;

        return i >= 0;
    }

    public bool TryAdd(OsmGeo item) => TryAddPointLocation(item as Node) || TryAddWayBoundingBox(item as Way);

    public int PointCount => ns.Count;

    public int BboxCount => bs.Count;
}

internal class ElementLocator
{
    private readonly Dictionary<long, Point> locs;

    public ElementLocator(ILogger logger, Dictionary<long, Point> locs)
    {
        this.locs = locs;

        if (logger.IsEnabled(LogLevel.Information))
        {
            logger.LogInformation("Created element locator with {Count} OSM elements.", locs.Count);
        }
    }

    public bool TryGetLocation(long id, out Point? location) => locs.TryGetValue(id, out location);
}

/// <summary>
/// Class specific for `relation` object location that are otherwise hard to
/// deduce directly from the dataset due to memory overconsumption.
///
/// URL: https://dev.overpass-api.de/overpass-doc/en/targets/formats.html
/// </summary>
internal static class OverpassElementLocatorFactory
{
    private class Item
    {
        public long id { get; set; }

        public required Point center { get; set; }
    }

    private class Response
    {
        public required List<Item> elements { get; set; }
    }

    private static double Round(double num) => Math.Round(num, 7);

    private static async Task<List<Item>> FetchSquare(ILogger logger, (double, double, double, double) bbox)
    {
        List<Item>? result = null;
        Thread.Sleep(1_000);

        var attempt = 0;
        var (w, n, e, s) = bbox;

        // url specialized for the osm `relation` type.
        var url = $"https://overpass-api.de/api/interpreter?data=[out:json];relation({s},{w},{n},{e})[type=multipolygon];out%20center;";

        if (logger.IsEnabled(LogLevel.Information))
        {
            logger.LogInformation("Contacting Overpass API endpoint for square w={w}, n={n}, e={e} s={s}.", w, n, e, s);
        }

        do
        {
            ++attempt;
            try
            {
                var res = await new HttpClient().GetAsync(url);
                var txt = await res.Content.ReadAsStringAsync();
                result = JsonSerializer.Deserialize<Response>(txt)?.elements;
            }
            catch (Exception)
            {
                logger.LogWarning("Failed to fetch, {attempt} attempt.", attempt);
                Thread.Sleep(10_000);
            }
        } while (result == null && attempt < 3);

        result ??= [];

        if (logger.IsEnabled(LogLevel.Information))
        {
            logger.LogInformation("Fetched {Count} entities.", result.Count);
        }

        return result;
    }

    /// <summary>
    /// Exception-free fetch with retry and default value in case of failure.
    /// </summary>
    private static async Task<List<Item>> Fetch(ILogger logger, List<string> bbox, int rows, int cols)
    {
        var result = new List<Item>();
        var (xW, xN, xE, xS) = Converter.ToBbox(bbox);

        var rowStep = (xN - xS) / rows;
        var colStep = (xE - xW) / cols;

        for (int row = 0; row < rows; ++row)
        {
            for (int col = 0; col < cols; ++col)
            {
                var s = Round(xS + rowStep * row);
                var n = Round(s + rowStep);

                var w = Round(xW + colStep * col);
                var e = Round(w + colStep);

                result.AddRange(await FetchSquare(logger, (w, n, e, s)));
            }
        }

        return result;
    }

    private static Dictionary<long, Point> Reduce(ILogger _, List<Item> items)
    {
        return items.Aggregate(new Dictionary<long, Point>(), (acc, item) =>
        {
            acc[item.id] = item.center; // .Add method fails upon repeated keys
            return acc;
        });
    }

    public static async Task<ElementLocator> GetInstance(ILogger logger, List<string> bbox, int rows, int cols)
    {
        return new(logger, Reduce(logger, await Fetch(logger, bbox, rows, cols)));
    }
}

/// <summary>
/// Currently NOT USED in favor of more stable Overpass API.
///
/// Class specific for `relation` object location that are otherwise hard
/// to deduce directly from the dataset due to memory overconsumption.
///
/// URL: https://sophox.org/
/// </summary>
internal static partial class SophoxElementLocatorFactory
{
    private class Value
    {
        public required string value { get; set; }
    }

    private class Entity
    {
        public required Value oid { get; set; }

        public required Value loc { get; set; }
    }

    private class Results
    {
        public required List<Entity> bindings { get; set; }
    }

    private class Response
    {
        public required Results results { get; set; }
    }

    private static string QueryBuilder((double, double, double, double) bbox)
    {
        var (w, n, e, s) = bbox;

        return $@"
            PREFIX bd: <http://www.bigdata.com/rdf#>
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
            }}}}
        ";
    }

    private static async Task<Response> Fetch(ILogger logger, List<string> bbox)
    {
        logger.LogInformation("Trying to contact Sophox endpoint.");
        var url = $"https://sophox.org/sparql?query={Uri.EscapeDataString(QueryBuilder(Converter.ToBbox(bbox)))}";

        var cli = new HttpClient
        {
            Timeout = TimeSpan.FromMinutes(10)
        };
        cli.DefaultRequestHeaders.Add("Accept", "application/sparql-results+json;charset=utf-8");

        var res = await cli.GetAsync(url);
        var txt = await res.Content.ReadAsStringAsync();

        var jsn = JsonSerializer.Deserialize<Response>(txt)!;

        if (logger.IsEnabled(LogLevel.Information))
        {
            logger.LogInformation("Fetched {Count} entities from Sophox.", jsn.results.bindings.Count);
        }

        return jsn;
    }

    [GeneratedRegex(@"^https://www.openstreetmap.org/relation/(?<oid>\d+)$", RegexOptions.IgnoreCase)]
    private static partial Regex OsmRelationUrlRegex();

    [GeneratedRegex(@"^Point\((?<lon>-?\d+(\.\d+)?) (?<lat>-?\d+(\.\d+)?)\)$", RegexOptions.IgnoreCase)]
    private static partial Regex WikidataPoingRegex();

    private static Dictionary<long, Point> Extract(ILogger logger, Response obj)
    {
        var dic = new Dictionary<long, Point>();

        foreach (var itm in obj.results.bindings)
        {
            var mid = OsmRelationUrlRegex().Match(itm.oid.value);
            var mpt = WikidataPoingRegex().Match(itm.loc.value);

            if (!mid.Success || !mpt.Success) { continue; }

            var id = long.Parse(mid.Groups["oid"].Value);

            var pt = new Point()
            {
                lon = double.Parse(mpt.Groups["lon"].Value),
                lat = double.Parse(mpt.Groups["lat"].Value)
            };

            dic[id] = pt;
        }

        if (logger.IsEnabled(LogLevel.Information))
        {
            logger.LogInformation("Extracted {Count} valid locations.", dic.Count);
        }

        return dic;
    }

    public static async Task<ElementLocator> GetInstance(ILogger logger, List<string> bbox)
    {
        return new(logger, Extract(logger, await Fetch(logger, bbox)));
    }
}
