using OsmSharp.Tags;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;

namespace osm;

internal static class KeywordExtractor
{
    private sealed class Item
    {
        public string value { get; set; }
    }

    private static readonly SortedSet<string> wi;
    private static readonly SortedSet<string> wo;
    private static readonly Dictionary<string, SortedSet<string>> ts = new();

    static KeywordExtractor()
    {
        wi = new()
        {
            "aerialway",
            "aeroway",
            "attraction",
            "club",
            "craft",
            "hazard",
            "healthcare",
            "historic",
            "tourism"
        };

        wo = new()
        {
            "amenity",
            "artwork_type",
            "building",
            "building:architecture",
            "building_type",
            "business",
            "emergency",
            "leisure",
//          "man_made",
            "natural",
            "office",
            "public_transport",
            "shop",
            "sport",
            "theatre:genre"
        };

        var union = wi.Union(wo);

        foreach (var key in union)
        {
            var json = File.ReadAllText(PathBuilder.GetTaginfoFilePath(key));
            ts.Add(key, new(JsonSerializer.Deserialize<List<Item>>(json).Select(i => i.value)));
        }
    }

    /// <summary>
    /// Split a value of a given tag into tokens. Valid token should appear
    /// within values extracted from https://taginfo.openstreetmap.org/.
    /// </summary>
    private static void ExtractImpl(string tag, TagsCollectionBase otags, SortedSet<string> keywords, bool wk)
    {
        if (otags.TryGetValue(tag, out var val))
        {
            var allow = ts[tag];

            var vs = val.Split(';', StringSplitOptions.RemoveEmptyEntries)
                .Select(v => v.Trim())
                .Select(v => Converter.SnakeToKeyword(v));

            foreach (var v in vs)
            {
                if (allow.Contains(v))
                {
                    keywords.Add(v);
                    if (wk) { keywords.Add(tag); }
                }
            }
        }
    }

    public static void Extract(TagsCollectionBase otags, SortedSet<string> keywords)
    {
        foreach (var w in wi)
        {
            ExtractImpl(w, otags, keywords, true);
        }

        foreach (var w in wo)
        {
            ExtractImpl(w, otags, keywords, false);
        }
    }
}
