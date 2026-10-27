using OsmSharp.Tags;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;

namespace osm;

/// <summary>
/// Each place must have at least one associated keyword. The extractor
/// </summary>
internal static class KeywordExtractor
{
    private sealed class Item
    {
        public string value { get; set; }
    }

    /// <summary>
    /// Keys that have potential to become a keyword if any value is found.
    /// </summary>
    private static readonly SortedSet<string> wi;

    /// <summary>
    /// Keys that are never considered as a keyword.
    /// </summary>
    private static readonly SortedSet<string> wo;

    /// <summary>
    /// Taginfo with k:v pairs, and occurrences for individual values.
    /// </summary>
    private static readonly Dictionary<string, SortedSet<string>> ts = [];

    static KeywordExtractor()
    {
        wi = [
            "aerialway",
            "aeroway",
            "attraction",
            "club",
            "craft",
            "hazard",
            "healthcare",
            "historic",
            "military",
            "playground",
            "tourism",
            "vending",
        ];

        wo = [
            "amenity",
            "artwork_type",
            "building",
            "building:architecture",
            "building_type",
            "business",
            "emergency",
            "leisure",
            "natural",
            "office",
            "public_transport",
            "shop",
            "social_facility",
            "sport",
            "theatre:genre",
        ];

        #region Omitted keys
            // clothes
            // cuisine
            // denomination
            // man_made
            // rental
        #endregion

        var union = wi.Union(wo);

        foreach (var key in union)
        {
            var json = File.ReadAllText(PathBuilder.GetTaginfoFilePath(key));
            ts.Add(key, [..JsonSerializer.Deserialize<List<Item>>(json).Select(i => i.value)]);
        }
    }

    /// <summary>
    /// Split a value of a given tag into tokens. Valid token should appear
    /// within popular values extracted from https://taginfo.openstreetmap.org/.
    /// </summary>
    private static void ExtractImpl(string key, TagsCollectionBase otags, SortedSet<string> keywords, bool wk)
    {
        if (otags.TryGetValue(key, out var val))
        {
            var allow = ts[key];

            var vs = val.Split(';', StringSplitOptions.RemoveEmptyEntries)
                .Select(v => v.Trim())
                .Select(Converter.SnakeToKeyword);

            foreach (var v in vs)
            {
                if (allow.Contains(v))
                {
                    keywords.Add(v);

                    // add also the key into possible keywords
                    if (wk)
                    {
                        keywords.Add(Converter.SnakeToKeyword(key));
                    }
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
