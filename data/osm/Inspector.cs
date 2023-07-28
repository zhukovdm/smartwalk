using OsmSharp;
using System.Collections.Generic;

namespace osm;

internal static class Inspector
{
    private static readonly Dictionary<long, Point> _nodes = new();

    public static Place Inspect(Node node)
    {
        if (node is not null)
        {
            /* Nodes are used for way and relation definitions. Not defined
             * nodes mean the file is broken, no reason to continue further. */

            var d = node.Id is not null && node.Longitude is not null && node.Latitude is not null;

            if (!d) { Reporter.ReportUndefined(node); }

            // extract and verify position

            var lon = node.Longitude.Value;
            var lat = node.Latitude.Value;

            if (!CrsEpsg3857.IsWithin(lon, lat)) { Reporter.ReportOutbound(node); }

            // keep node for later usage

            _nodes.Add(node.Id.Value, new() { lon = lon, lat = lat });

            if (node.Tags is null || node.Tags.Count == 0) { return null; }

            // extract keywords and tags

            var grain = new Place();
            KeywordExtractor.Extract(node.Tags, grain.keywords);

            if (grain.keywords.Count > 0)
            {
                AttributeExtractor.Extract(node.Tags, grain);
                NameExtractor.Extract(node.Tags, grain);
                LinkedExtractor.Extract(node, grain.linked);

                grain.location = new() { lon = lon, lat = lat };
                grain.position = new(lon, lat);

                return grain;
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

            if (way.Id is null || way.Nodes is null) { Reporter.ReportUndefined(way); }

            // small or open ways are skipped, closed polygons pass

            if (way.Nodes.Length < 4 || way.Nodes[0] != way.Nodes[^1] || way.Tags is null || way.Tags.Count == 0) { return null; }

            var grain = new Place();

            if (!TryGetSequence(way, out var seq)) { return null; }

            KeywordExtractor.Extract(way.Tags, grain.keywords);

            if (grain.keywords.Count > 0)
            {
                AttributeExtractor.Extract(way.Tags, grain);
                NameExtractor.Extract(way.Tags, grain);
                LinkedExtractor.Extract(way, grain.linked);

                /* Note that both IsCounterClockwise and Centroid
                 * use closedness of the shape verified above. */

                /* GeoJSON assumes counterclockwise external rings,
                 * see https://www.rfc-editor.org/rfc/rfc7946#appendix-B.1! */

                if (!Cartesian.IsCounterClockwise(seq)) { seq.Reverse(); }
                var cen = Cartesian.Centroid(seq);

                grain.attributes.polygon = seq;

                grain.location = new() { lon = cen.lon, lat = cen.lat };
                grain.position = new(cen.lon, cen.lat);

                return grain;
            }
        }

        return null;
    }
}
