using System;
using System.Linq;
using OsmSharp.Tags;

namespace osm;

internal class NameExtractor
{
    public static void Extract(TagsCollectionBase tags, Place grain)
    {
        string name = null;
        var ks = new string[] { "name:en", "name", "alt_name", "brand", "operator" };

        foreach (var k in ks)
        {
            if (name is null && tags.TryGetValue(k, out var v) && Verifier.IsNonTrivialString(v))
            {
                name = v;
            }
        }
        name ??= "Noname";

        grain.name = name;
        grain.attributes.name = name;
    }
}
