using System.Collections.Generic;
using System.Linq;
using SmartWalk.Domain.Entities;

namespace SmartWalk.Domain.Extensions;

public static class ListExtensions
{
    public static List<Place> WithMergedCategories(this List<Place> places)
    {
        var result = new Dictionary<string, Place>();

        foreach (var place in places)
        {
            if (result.TryGetValue(place.smartId, out var p))
            {
                p.categories.UnionWith(place.categories);
            }
            else { result.Add(place.smartId, place); }
        }
        return result.Values.ToList();
    }
}
