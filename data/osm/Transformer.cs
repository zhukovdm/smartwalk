using System;
using System.Collections.Generic;
using OsmSharp;

namespace osm;

internal class Transformer(ElementLocator1 locator)
{
    private readonly ElementLocator1 locator = locator;

    /// <summary>
    /// Round coordinate to the preferred number of fractional digits.
    /// </summary>
    private static double Round(double coordinate) => Math.Round(coordinate, 7);


    /// <summary>
    /// https://wiki.openstreetmap.org/wiki/Node
    /// </summary>
    private Place? Transform(Node? node)
    {
        if (node is null) { return null; }

        // node must have a valid identifier and location
        if (!locator.TryGetPointLocation(node?.Id ?? -1, out var n))
        {
            return null;
        }

        // empty nodes are skipped
        if (node!.Tags is null || node.Tags.Count == 0)
        {
            return null;
        }

        SortedSet<string> keywords = [];
        KeywordExtractor.Extract(node.Tags, keywords);

        // each place must be associated with at least one keyword
        if (keywords.Count > 0)
        {
            var place = new Place()
            {
                keywords = keywords,
            };

            AttributeExtractor.Extract(node.Tags, place);
            NameExtractor.Extract(node.Tags, place);
            LinkedExtractor.Extract(node, place.linked);

            place.location = new() { lon = Round(n.Loc.Lon), lat = Round(n.Loc.Lat) };
            return place;
        }

        return null;
    }

    /// <summary>
    /// https://wiki.openstreetmap.org/wiki/Way
    /// </summary>
    private Place? Transform(Way? way)
    {
        if (way is null) { return null; }

        if (!locator.TryGetWayBoundingBox(way?.Id ?? -1, out var _))
        {
            return null;
        }

        locator.TryGetPointSequence(way!.Nodes, out var seq);

        // empty ways are skipped
        if (way.Tags is null || way.Tags.Count == 0) { return null; }

        SortedSet<string> keywords = [];
        KeywordExtractor.Extract(way.Tags, keywords);

        if (keywords.Count > 0)
        {
            var place = new Place()
            {
                keywords = keywords,
            };

            AttributeExtractor.Extract(way.Tags, place);
            NameExtractor.Extract(way.Tags, place);
            LinkedExtractor.Extract(way, place.linked);

            // Note that both IsCounterClockwise and Centroid
            // use closedness of the shape verified above.

            /* GeoJSON assumes counterclockwise external rings,
            ** see https://www.rfc-editor.org/rfc/rfc7946#appendix-B.1! */

            if (!Cartesian.IsCounterClockwise(seq)) { seq.Reverse(); }
            var cen = Cartesian.Centroid(seq);

            place.attributes.polygon = seq;
            place.location = new() { lon = Round(cen.lon), lat = Round(cen.lat), };

            return place;
        }

        return null;
    }

    private bool TryGetRelLocation(Relation rel, out Point? loc)
    {
        var ans = false; loc = null;
        var minLon = double.MaxValue;
        var maxLon = double.MinValue;
        var minLat = double.MaxValue;
        var maxLat = double.MinValue;

        if (rel.Tags?.Contains("type", "multipolygon") is not true)
        {
            return ans;
        }

        foreach (var m in rel.Members)
        {
            if (m.Type == OsmGeoType.Node)
            {
                if (!locator.TryGetPointLocation(m.Id, out var n)) { return false; }

                minLon = Math.Min(minLon, n.Loc.Lon);
                maxLon = Math.Max(maxLon, n.Loc.Lon);
                minLat = Math.Min(minLat, n.Loc.Lat);
                maxLat = Math.Max(maxLat, n.Loc.Lat);
                ans = true;
            }

            if (m.Type == OsmGeoType.Way)
            {
                if (!locator.TryGetWayBoundingBox(m.Id, out var b)) { return false; }

                minLon = Math.Min(minLon, b.Loc.MinLon);
                maxLon = Math.Max(maxLon, b.Loc.MaxLon);
                minLat = Math.Min(minLat, b.Loc.MinLat);
                maxLat = Math.Max(maxLat, b.Loc.MaxLat);
                ans = true;
            }

            if (m.Type == OsmGeoType.Relation)
            {
                // do nothing
            }
        }

        if (ans)
        {
            loc = new()
            {
                lon = minLon + ((maxLon - minLon) / 2),
                lat = minLat + ((maxLat - minLat) / 2),
            };
        }

        return ans;
    }

    /// <summary>
    /// https://wiki.openstreetmap.org/wiki/Relation
    /// </summary>
    private Place? Transform(Relation? relation)
    {
        if (relation is not null)
        {
            if (relation.Id is null) { Reporter.ThrowOnUndefined(relation, "relation"); }

            if (relation.Tags is null || relation.Tags.Count == 0) { return null; }

            if (TryGetRelLocation(relation, out var loc))
            {
                var place = new Place();
                KeywordExtractor.Extract(relation.Tags, place.keywords);

                if (place.keywords.Count > 0)
                {
                    AttributeExtractor.Extract(relation.Tags, place);
                    NameExtractor.Extract(relation.Tags, place);
                    LinkedExtractor.Extract(relation, place.linked);

                    place.location = new() { lon = Round(loc!.lon), lat = Round(loc.lat) };

                    return place;
                }
            }
        }

        return null;
    }

    public Place? Transform(OsmGeo element)
    {
        return Transform(element as Node) ?? Transform(element as Way) ?? Transform(element as Relation);
    }
}
