using System.Collections.Generic;
using SmartWalk.Core.Entities;
using SmartWalk.Domain.Entities;

namespace SmartWalk.Core.Heuristics;

internal static class PlaceConverter
{
    public static List<SolverPlace> Convert(IReadOnlyList<Place> places)
    {
        var result = new List<SolverPlace>();

        for (int i = 0; i < places.Count; ++i)
        {
            foreach (var c in places[i].categories) { result.Add(new(i, c)); }
        }
        return result;
    }
}
