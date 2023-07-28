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

    private sealed class AssocPair
    {
        public SortedSet<string> values { get; set; }

        public SortedSet<string> enrich { get; set; }
    }

    private static readonly SortedSet<string> _wi;
    private static readonly SortedSet<string> _wo;
    private static readonly Dictionary<string, List<AssocPair>> _as;
    private static readonly Dictionary<string, SortedSet<string>> _ts = new();

    static KeywordExtractor()
    {
        _wi = new()
        {
            "aerialway",
            "aeroway",
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
            "attraction",
            "building",
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
            var path = string.Join(Path.DirectorySeparatorChar, new[] { Constants.ASSETS_BASE_ADDR, "tags", key + ".json" });
            var json = File.ReadAllText(path);
            _ts.Add(key, new(JsonSerializer.Deserialize<List<Item>>(json).Select(i => i.value)));
        }

        {
            var path = string.Join(Path.DirectorySeparatorChar, new[] { Constants.RESOURCES_BASE_ADDR, "enrich", "assoc.json" });
            var json = File.ReadAllText(path);
            _as = JsonSerializer.Deserialize<Dictionary<string, List<AssocPair>>>(json);

            foreach (var item in union)
            {
                if (!_as.ContainsKey(item)) { _as[item] = new(); } // ensure empty set for all tags!
            }
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
            var assoc = _as[tag];

            var vs = val.Split(';', StringSplitOptions.RemoveEmptyEntries)
                .Select(v => v.Trim())
                .Select(v => Converter.SnakeToKeyword(v));

            foreach (var v in vs)
            {
                if (allow.Contains(v))
                {
                    keywords.Add(v);
                    if (wk) { keywords.Add(tag); }

                    foreach (var a in assoc)
                    {
                        if (a.values.Contains(v))
                        {
                            foreach (var e in a.enrich) { keywords.Add(e); }
                        }
                    }
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
