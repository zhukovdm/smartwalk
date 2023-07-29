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

    private static readonly SortedSet<string> _wi;
    private static readonly SortedSet<string> _wo;
    private static readonly Dictionary<string, SortedSet<string>> _ts = new();

    static KeywordExtractor()
    {
        _wi = new()
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

        _wo = new()
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

        var union = _wi.Union(_wo);

        foreach (var key in union)
        {
            var path = string.Join(Path.DirectorySeparatorChar, new[] { Constants.ASSETS_BASE_ADDR, "taginfo", key + ".json" });
            var json = File.ReadAllText(path);
            _ts.Add(key, new(JsonSerializer.Deserialize<List<Item>>(json).Select(i => i.value)));
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
            var allow = _ts[tag];

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
        foreach (var w in _wi)
        {
            ExtractImpl(w, otags, keywords, true);
        }

        foreach (var w in _wo)
        {
            ExtractImpl(w, otags, keywords, false);
        }
    }
}
