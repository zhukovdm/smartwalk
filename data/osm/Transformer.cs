using System;
using System.Collections.Generic;
using OsmSharp;

namespace osm;

internal class Transformer(ElementLocator locator)
{
    /// <summary>
    /// Round coordinate to the allowed number of fractional digits.
    /// </summary>
    private static double Round(double coordinate)
    {
        return Math.Round(coordinate, 7);
    }

    private readonly struct N(double lat, double lon)
    {
        public readonly double lat = lat;
        public readonly double lon = lon;
    }

    private readonly struct W
    {
        public readonly double MaxLat = double.MinValue;
        public readonly double MinLat = double.MaxValue;
        public readonly double MaxLon = double.MinValue;
        public readonly double MinLon = double.MaxValue;

        public W(IEnumerable<Point> seq)
        {
            foreach (var p in seq)
            {
                MaxLat = Math.Max(MaxLat, p.lat);
                MinLat = Math.Min(MinLat, p.lat);
                MaxLon = Math.Max(MaxLon, p.lon);
                MinLon = Math.Min(MinLon, p.lon);
            }
        }
    }

    /// <summary>
    /// Cache with Nodes to complete way and relation definitions.
    /// </summary>
    private readonly Dictionary<long, N> ns = [];

    /// <summary>
    /// Cache with Ways to complete relation definitions.
    /// </summary>
    private readonly Dictionary<long, W> ws = [];

    private readonly ElementLocator locator = locator;

    /// <summary>
    /// Places are processed as follows:
    ///
    /// <list type="bullet">
    ///     <item>Check a place definition, not properly defined places terminate processing.</item>
    ///     <item>Check a place definition is within what the map can show. Failure terminates processing.</item>
    /// </list>
    /// </summary>
    private Place Transform(Node node)
    {
        if (node is not null)
        {
            /* Nodes are used for way and relation definitions. Missing
            ** essential parts means the entire file is broken, and there
            ** is no reason to continue further.
            **
            ** TODO: consider to relax this rule. */

            var d = node.Id is not null && node.Longitude is not null && node.Latitude is not null;

            if (!d) { Reporter.ThrowOnUndefined(node, "node"); }

            /* extract and verify position */

            var lon = Round(node.Longitude.Value);
            var lat = Round(node.Latitude.Value);
            var loc = new Point() { lon = lon, lat = lat };

            // node is outside of what map defines/ can depict
            if (!CrsEpsg3857.IsWithin(lon, lat)) { Reporter.ThrowOnOutbound(node); }

            // keep node for way and relation definitions
            ns.Add(node.Id.Value, new(loc.lat, loc.lon));

            if (node.Tags is null || node.Tags.Count == 0) { return null; }

            // extract keywords and tags

            var place = new Place();

            // places are associated with search keywords used in core search
            KeywordExtractor.Extract(node.Tags, place.keywords);

            if (place.keywords.Count > 0)
            {
                AttributeExtractor.Extract(node.Tags, place);
                NameExtractor.Extract(node.Tags, place);
                LinkedExtractor.Extract(node, place.linked);

                place.location = loc;

                return place;
            }
        }

        return null;
    }

    private bool TryGetSequence(Way way, out List<Point> sequence)
    {
        sequence = [];

        foreach (var id in way.Nodes)
        {
            if (!ns.TryGetValue(id, out var node)) { return false; }
            sequence.Add(new() { lon = node.lon, lat = node.lat });
        }

        return true;
    }

    private Place Transform(Way way)
    {
        if (way is not null)
        {
            // check if the way is properly defined, and throw if not
            if (way.Id is null || way.Nodes is null) { Reporter.ThrowOnUndefined(way, "way"); }

            // small or open ways are skipped, closed polygons pass

            if (way.Nodes.Length < 4 || way.Nodes[0] != way.Nodes[^1] || way.Tags is null || way.Tags.Count == 0) { return null; }

            var place = new Place();

            if (!TryGetSequence(way, out var seq)) { return null; }

            KeywordExtractor.Extract(way.Tags, place.keywords);

            if (place.keywords.Count > 0)
            {
                AttributeExtractor.Extract(way.Tags, place);
                NameExtractor.Extract(way.Tags, place);
                LinkedExtractor.Extract(way, place.linked);

                /* Note that both IsCounterClockwise and Centroid
                ** use closedness of the shape verified above. */

                /* GeoJSON assumes counterclockwise external rings,
                ** see https://www.rfc-editor.org/rfc/rfc7946#appendix-B.1! */

                if (!Cartesian.IsCounterClockwise(seq)) { seq.Reverse(); }
                var cen = Cartesian.Centroid(seq);

                place.attributes.polygon = seq;
                place.location = new() { lon = Round(cen.lon), lat = Round(cen.lat) };

                return place;
            }
        }

        return null;
    }

    private Place Transform(Relation relation)
    {
        if (relation is not null)
        {
            if (relation.Id is null) { Reporter.ThrowOnUndefined(relation, "relation"); }

            if (relation.Tags is null || relation.Tags.Count == 0) { return null; }

            if (locator.TryGetLocation(relation.Id.Value, out var loc))
            {
                var place = new Place();
                KeywordExtractor.Extract(relation.Tags, place.keywords);

                if (place.keywords.Count > 0)
                {
                    AttributeExtractor.Extract(relation.Tags, place);
                    NameExtractor.Extract(relation.Tags, place);
                    LinkedExtractor.Extract(relation, place.linked);

                    place.location = new() { lon = Round(loc.lon), lat = Round(loc.lat) };

                    return place;
                }
            }
        }

        return null;
    }

    public Place Transform(OsmGeo element)
    {
        return Transform(element as Node)
            ?? Transform(element as Way)
            ?? Transform(element as Relation);
    }
}
