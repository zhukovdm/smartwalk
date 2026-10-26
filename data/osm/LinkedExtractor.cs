using System.Text.RegularExpressions;
using OsmSharp;
using OsmSharp.Tags;

namespace osm;

internal partial class LinkedExtractor
{
    [GeneratedRegex(@"^Q[1-9][0-9]*$")]
    private static partial Regex WikidataIdRegex();

    private static void Wikidata(TagsCollectionBase tags, Linked link)
    {
        if (tags.TryGetValue("wikidata", out var v) && WikidataIdRegex().IsMatch(v))
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

    public static void Extract(Relation relation, Linked link)
    {
        link.osm = "relation/" + relation.Id.Value.ToString();
        Wikidata(relation.Tags, link);
    }
}
