using System;
using System.Collections.Generic;
using System.Linq;
using SmartWalk.Core.Entities;
using SmartWalk.Core.Interfaces;

namespace SmartWalk.Core.Heuristics;

internal static class IfCategoryFormer
{
    /// <summary>
    /// Categories with less items are more relevant.
    /// </summary>
    internal sealed class CategoryComparer : IComparer<List<SolverPlace>>
    {
        private CategoryComparer() { }

        private static readonly Lazy<CategoryComparer> _instance = new(() => new());

        public static CategoryComparer Instance { get { return _instance.Value; } }

        public int Compare(List<SolverPlace> l, List<SolverPlace> r) => l.Count.CompareTo(r.Count);
    }

    /// <summary>
    /// Separate points by category.
    /// </summary>
    private static List<List<SolverPlace>> Group(
        IEnumerable<SolverPlace> places, int sourceCat, int targetCat)
    {
        var groups = places
            .Aggregate(new SortedDictionary<int, List<SolverPlace>>(), (acc, place) =>
            {
                if (!acc.ContainsKey(place.cat))
                {
                    acc.Add(place.cat, new());
                }
                acc[place.cat].Add(place);
                return acc;
            });

        // remove source and target cats!

        groups.Remove(sourceCat);
        groups.Remove(targetCat);

        return groups.Values.ToList();
    }

    /// <summary>
    /// Sort categories by number of elements in ascending order.
    /// </summary>
    private static List<List<SolverPlace>> Sort(List<List<SolverPlace>> categories)
    {
        categories.Sort(CategoryComparer.Instance);
        return categories;
    }

    /// <summary>
    /// Group places by category and sort categories by relevancy.
    /// </summary>
    public static List<List<SolverPlace>> Form(
        IEnumerable<SolverPlace> places, int sourceCat, int targetCat)
    {
        return Sort(Group(places, sourceCat, targetCat));
    }
}

internal static class IfCandidateSelector
{
    private static (SolverPlace, double, int) GetDefaults() => (null, double.MaxValue, -1);

    private static double NextDistance(
        IReadOnlyList<SolverPlace> seq, IDistanceMatrix distMatrix, SolverPlace place, double currDist, int seqIdx)
    {
        // remove one edge, and add two other edges

        return currDist
            - distMatrix.GetDistance(seq[seqIdx - 1].idx, seq[seqIdx].idx)
            + distMatrix.GetDistance(seq[seqIdx - 1].idx, place.idx)
            + distMatrix.GetDistance(place.idx,           seq[seqIdx].idx);
    }

    /// <summary>
    /// Select the best candidate out of all available places.
    /// </summary>
    public static (SolverPlace, double, int) SelectBest(
        IReadOnlyList<SolverPlace> seq, IReadOnlyList<SolverPlace> cat, IDistanceMatrix distMatrix, IPrecedenceMatrix precMatrix, double currDist)
    {
        /* WLOG, `currDist` can be 0.0. We return new distance to simplify the
         * caller's body. */

        (SolverPlace best, double lastDist, int seqIdx) = GetDefaults();

        foreach (var place in cat)
        {
            // insertion shall not affect the source

            for (int i = 1 /* source is skipped */; i < seq.Count; ++i)
            {
                /* 
                 * Category cannot use any further indices for insertion,
                 * because it shall precede the category on position i-1.
                 */

                if (precMatrix.IsBefore(place.cat, seq[i - 1].cat))
                {
                    break;
                }

                /* 
                 * Place in the sequence shall come before the considered
                 * one. Already found best placement is no longer relevant,
                 * and position `i` is not considered.
                 */

                if (precMatrix.IsBefore(seq[i].cat, place.cat))
                {
                    (best, lastDist, seqIdx) = GetDefaults();
                    continue; // !
                }

                var candDist = NextDistance(seq, distMatrix, place, currDist, i);

                // update state if a better candidate is found

                if (candDist < lastDist)
                {
                    best = place;
                    lastDist = candDist;
                    seqIdx = i;
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
    /// <summary></summary>
    /// <param name="source">Starting place.</param>
    /// <param name="target">Destination.</param>
    /// <param name="places">All places.</param>
    /// <param name="distMatrix">Distance matrix.</param>
    /// <param name="precMatrix">Transitive closure of a category graph.</param>
    /// <returns></returns>
    public static List<SolverPlace> Advise(
        SolverPlace source, SolverPlace target, IEnumerable<SolverPlace> places, IDistanceMatrix distMatrix, IPrecedenceMatrix precMatrix)
    {
        var seq = new List<SolverPlace>() { source, target };
        var currDist = distMatrix.GetDistance(source.idx, target.idx);

        var cats = IfCategoryFormer.Form(places, source.cat, target.cat);

        foreach (var cat in cats)
        {
            var (best, nextDist, seqIdx) = IfCandidateSelector
                .SelectBest(seq, cat, distMatrix, precMatrix, currDist);

            if (best is null) { break; } // no candidates left!

            currDist = nextDist;
            seq.Insert(seqIdx, best);
        }

        return seq;
    }
}
