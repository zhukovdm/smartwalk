using System;
using System.Linq;
using OsmSharp.Tags;

namespace osm;

internal class NameExtractor
{
    public static void Extract(TagsCollectionBase tags, Place place)
    {
        var ks = new string[] { "name:en", "name", "alt_name", "brand", "operator" };

        foreach (var k in ks)
        {
            if (place.name is null && tags.TryGetValue(k, out var v) && Verifier.IsNonTrivialString(v))
            {
                place.name = v;
            }
        }

        if (place.name is null)
        {
            var keyword = place.keywords.ToList()[new Random().Next(place.keywords.Count)];
            place.name = string.Concat(char.ToUpper(keyword[0]).ToString(), keyword.AsSpan(1));
        }
    }
}
