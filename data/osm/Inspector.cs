using System;
using System.Collections.Generic;
using OsmSharp;

namespace osm;

internal static class Inspector
{
    /// <summary>
    /// Round coordinate to the allowed number of fractional digits.
    /// </summary>
    private static double Round(double coordinate) => Math.Round(coordinate, 7);

    private static readonly Dictionary<long, Point> _nodes = new();

    public static Place Inspect(Node node)
    {
        if (node is not null)
        {
            /* Nodes are used for way and relation definitions. Not defined
             * nodes mean the file is broken, no reason to continue further. */

            var d = node.Id is not null && node.Longitude is not null && node.Latitude is not null;

            if (!d) { Reporter.ReportUndefined(node, "node"); }

            // extract and verify position

            var lon = Round(node.Longitude.Value);
            var lat = Round(node.Latitude.Value);
            var loc = new Point() { lon = lon, lat = lat };

            if (!CrsEpsg3857.IsWithin(lon, lat)) { Reporter.ReportOutbound(node); }

            // keep node for later usage

            _nodes.Add(node.Id.Value, loc);

            if (node.Tags is null || node.Tags.Count == 0) { return null; }

            // extract keywords and tags

            var place = new Place();
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

    private static bool TryGetSequence(Way way, out List<Point> sequence)
    {
        sequence = new();

        foreach (var id in way.Nodes)
        {
            if (!_nodes.TryGetValue(id, out var node)) { return false; }
            sequence.Add(new() { lon = node.lon, lat = node.lat });
        }

        return true;
    }

    public static Place Inspect(Way way)
    {
        if (way is not null)
        {
            // check if the way is properly defined

            if (way.Id is null || way.Nodes is null) { Reporter.ReportUndefined(way, "way"); }

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
                 * use closedness of the shape verified above. */

                /* GeoJSON assumes counterclockwise external rings,
                 * see https://www.rfc-editor.org/rfc/rfc7946#appendix-B.1! */

                if (!Cartesian.IsCounterClockwise(seq)) { seq.Reverse(); }
                var cen = Cartesian.Centroid(seq);

                place.attributes.polygon = seq;
                place.location = new() { lon = Round(cen.lon), lat = Round(cen.lat) };

                return place;
            }
        }

        return null;
    }

    public static Place Inspect(Relation relation, Locator locator)
    {
        if (relation is not null)
        {
            if (relation.Id is null) { Reporter.ReportUndefined(relation, "relation"); }

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
}
