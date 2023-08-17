using System.Collections.Generic;
using System.Linq;
using SmartWalk.Domain.Entities;
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
    private static List<List<SolverPlace>> Group(List<SolverPlace> places, int catsCount)
    {
        var groups = places.Aggregate(new SortedDictionary<int, List<SolverPlace>>(), (acc, place) =>
        {
            if (!acc.ContainsKey(place.cat))
            {
                acc.Add(place.cat, new());
            }
            acc[place.cat].Add(place);
            return acc;
        });

        // remove source and target cats!

        groups.Remove(catsCount + 0);
        groups.Remove(catsCount + 1);

        return groups.Values.ToList();
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
    public static List<List<SolverPlace>> Form(List<SolverPlace> places, int catsCount)
        => Sort(Group(places, catsCount));
}

internal static class IfCandidateFinder
{
    private static double NextDistance(
        List<SolverPlace> seq, IDistanceMatrix distMatrix, SolverPlace place, double currDist, int seqIdx)
    {
        return currDist
            - distMatrix.GetDistance(seq[seqIdx - 1].idx, seq[seqIdx].idx)
            + distMatrix.GetDistance(seq[seqIdx - 1].idx, place.idx)
            + distMatrix.GetDistance(place.idx,           seq[seqIdx].idx);
    }

    public static (SolverPlace, double, int) FindBest(
        List<SolverPlace> seq, List<SolverPlace> cat, IDistanceMatrix distMatrix, IPrecedenceMatrix precMatrix, double currDist)
    {
        SolverPlace best = null;
        double lastDist = double.MaxValue;

        int seqIdx = -1;

        foreach (var place in cat)
        {
            for (int i = 1; i < seq.Count; ++i)
            {
                // category cannot be inserted

                if (precMatrix.IsBefore(place.cat, seq[i - 1].cat))
                {
                    break;
                }

                // try insert in the next step

                if (precMatrix.IsBefore(seq[i].cat, place.cat))
                {
                    continue;
                }

                var candDist = NextDistance(seq, distMatrix, place, currDist, i);

                if (candDist < lastDist)
                {
                    seqIdx = i;
                    best = place;
                    lastDist = candDist;
                }
            }
        }

        return (best, lastDist, seqIdx);
    }
}

/// <summary>
/// The Infrequent-First Heuristic (https://doi.org/10.1145/1463434.1463449)
/// extended to handle precedence constraints.
/// </summary>
internal sealed class IfHeuristic
{
    /// <param name="precMatrix">Transitive closure of a category graph.</param>
    public static List<SolverPlace> Advise(
        List<SolverPlace> places, IDistanceMatrix distMatrix, IPrecedenceMatrix precMatrix)
    {
        var seq = new List<SolverPlace>() { places[^2], places[^1] };
        var currDist = distMatrix.GetDistance(distMatrix.Count - 2, distMatrix.Count - 1);

        var cats = IfCategoryFormer.Form(places, precMatrix.CsCount);

        foreach (var cat in cats)
        {
            var (best, nextDist, seqIdx) = IfCandidateFinder
                .FindBest(seq, cat, distMatrix, precMatrix, currDist);

            if (best is null) { break; } // no candidates left!

            currDist = nextDist;
            seq.Insert(seqIdx, best);
        }

        return seq;
    }
}
