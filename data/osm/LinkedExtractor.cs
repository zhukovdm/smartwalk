using System.Text.RegularExpressions;
using OsmSharp;
using OsmSharp.Tags;

namespace osm;

internal class LinkedExtractor
{
    private static void Wikidata(TagsCollectionBase tags, Linked link)
    {
        if (tags.TryGetValue("wikidata", out var v) && Regex.IsMatch(v, @"^Q[1-9][0-9]*$"))
        {
            link.wikidata = v;
        }
    }

    public static void Extract(Node node, Linked link)
    {
        link.osm = "node/" + node.Id.Value.ToString();
        Wikidata(node.Tags, link);
    }

    public static void Extract(Way way, Linked link)
    {
        link.osm = "way/" + way.Id.Value.ToString();
        Wikidata(way.Tags, link);
    }
}
