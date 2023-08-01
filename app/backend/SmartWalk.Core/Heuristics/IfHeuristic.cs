using System.Collections.Generic;
using System.Linq;
using SmartWalk.Core.Entities;
using SmartWalk.Domain.Interfaces;

namespace SmartWalk.Core.Heuristics;

internal sealed class IfCategoryComparer : IComparer<List<SolverPlace>>
{
    /// <summary>
    /// Categories with less items are more relevant.
    /// </summary>
    public int Compare(List<SolverPlace> l, List<SolverPlace> r) => l.Count.CompareTo(r.Count);
}

internal static class IfCategoryFormer
{
    /// <summary>
    /// Separate points by category.
    /// </summary>
    private static List<List<SolverPlace>> Group(IReadOnlyList<SolverPlace> places)
    {
        return places.Aggregate(new SortedDictionary<int, List<SolverPlace>>(), (acc, place) =>
        {
            if (!acc.ContainsKey(place.Category))
            {
                acc.Add(place.Category, new());
            }
            acc[place.Category].Add(place);
            return acc;
        }).Values.ToList();
    }

    /// <summary>
    /// Sort categories by number of elements in ascending order.
    /// </summary>
    private static List<List<SolverPlace>> Sort(List<List<SolverPlace>> categories)
    {
        categories.Sort(new IfCategoryComparer());
        return categories;
    }

    /// <summary>
    /// Group places by category and sort categories by relevancy.
    /// </summary>
    public static List<List<SolverPlace>> Form(IReadOnlyList<SolverPlace> places)
        => Sort(Group(places));
}

internal static class IfCandidateFinder
{
    /// <summary>
    /// Given a certain category, find a pair of place and position for
    /// insertion that gives the smallest distance increase.
    /// </summary>
    public static (SolverPlace, double, int) FindBest(
        IReadOnlyList<int> seq, IReadOnlyList<SolverPlace> cat, IDistanceMatrix matrix, double currDist)
    {
        SolverPlace best = null;
        double lastDist = double.MaxValue;

        int index = -1;

        foreach (var place in cat)
        {
            for (int i = 1; i < seq.Count; ++i)
            {
                var candDist = DistanceAdjuster
                    .NextDistance(seq, matrix, place, currDist, i);

                if (candDist < lastDist)
                {
                    index = i;
                    best = place;
                    lastDist = candDist;
                }
            }
        }

        return (best, lastDist, index);
    }
}

/// <summary>
/// Infrequent-First Heuristic, see https://doi.org/10.1145/1463434.1463449.
/// </summary>
internal static class IfHeuristic
{
    /// <summary>
    /// Advise a route.
    /// </summary>
    public static List<int> Advise(
        IReadOnlyList<SolverPlace> places, IDistanceMatrix matrix, double maxDist, int placesCount)
    {
        var seq = new List<int>() { 0, placesCount - 1 };
        var currDist = matrix.Distance(0, placesCount - 1);

        var cats = IfCategoryFormer.Form(places);

        foreach (var cat in cats)
        {
            var (best, nextDist, seqIndex) = IfCandidateFinder.FindBest(seq, cat, matrix, currDist);

            if (best is not null && nextDist <= maxDist * 1.0)
            {
                currDist = nextDist;
                seq.Insert(seqIndex, best.Index);
            }
        }

        return seq;
    }
}
