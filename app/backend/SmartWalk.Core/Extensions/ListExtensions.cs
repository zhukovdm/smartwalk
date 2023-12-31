using System;
using System.Collections.Generic;
using System.Linq;
using SmartWalk.Core.Entities;

namespace SmartWalk.Core.Extensions;

public static class ListExtensions
{
    /// <summary>
    /// Swap elements of the list on `left` and `right` positions.
    /// </summary>
    public static void Swap<T>(this List<T> list, int l, int r)
    {
        (list[r], list[l]) = (list[l], list[r]);
    }

    /// <summary>
    /// In-place random shuffle.
    /// </summary>
    public static List<T> DurstenfeldShuffle<T>(this List<T> list)
    {
        var rnd = new Random();

        for (int i = 0; i < list.Count - 2; ++i)
        {
            list.Swap(i, rnd.Next(i, list.Count));
        }
        return list;
    }

    /// <summary>
    /// Group places by identifiers and merge their category sets.
    /// </summary>
    /// <param name="places">List of places.</param>
    /// <returns>List of places with merged category sets.</returns>
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
