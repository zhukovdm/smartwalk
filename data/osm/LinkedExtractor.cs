using System.Text.RegularExpressions;
using OsmSharp;
using OsmSharp.Tags;

namespace osm;

/// <summary>
/// Places are linked back to OSM and Wikidata (if applicable) identifiers to
/// make updates possible.
/// </summary>
internal partial class LinkedExtractor
{
    [GeneratedRegex(@"^Q[1-9][0-9]*$")]
    private static partial Regex WikidataIdRegex();

    private static void LinkWikidata(TagsCollectionBase tags, Linked link)
    {
        if (tags.TryGetValue("wikidata", out var v) && WikidataIdRegex().IsMatch(v))
        {
            link.wikidata = v;
        }
    }

    public static void Extract(Node node, Linked link)
    {
        link.osm = "node/" + node.Id!.Value.ToString();
        LinkWikidata(node.Tags, link);
    }

    public static void Extract(Way way, Linked link)
    {
        link.osm = "way/" + way.Id!.Value.ToString();
        LinkWikidata(way.Tags, link);
    }

    public static void Extract(Relation relation, Linked link)
    {
        link.osm = "relation/" + relation.Id!.Value.ToString();
        LinkWikidata(relation.Tags, link);
    }
}
