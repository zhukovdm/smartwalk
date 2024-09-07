using System;
using System.Collections.Generic;
using System.Linq;
using SmartWalk.Core.Entities;
using SmartWalk.Core.Interfaces;

namespace SmartWalk.Core.Heuristics;

internal static class IfCategoryFormer
{
    internal sealed class CategoryComparer : IComparer<List<SolverPlace>>
    {
        private CategoryComparer() { }

        private static readonly Lazy<CategoryComparer> instance = new(() => new());

        public static CategoryComparer Instance { get { return instance.Value; } }

        /// <summary>
        /// Categories with less items are more relevant (smaller).
        /// </summary>
        public int Compare(List<SolverPlace> l, List<SolverPlace> r)
        {
            return l.Count.CompareTo(r.Count);
        }
    }

    /// <summary>
    /// Separate points by category.
    /// </summary>
    /// <param name="places">Input places</param>
    /// <returns></returns>
    private static List<List<SolverPlace>> Group(IEnumerable<SolverPlace> places)
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

        return groups.Values.ToList();
    }

    /// <summary>
    /// Sort categories by number of elements in ascending order.
    /// </summary>
    /// <param name="cats">List of categories.</param>
    /// <returns>Sorted list of categories.</returns>
    private static List<List<SolverPlace>> Sort(List<List<SolverPlace>> cats)
    {
        cats.Sort(CategoryComparer.Instance);
        return cats;
    }

    /// <summary>
    /// Group places by category and sort categories by relevancy.
    /// </summary>
    /// <param name="places">Input places.</param>
    /// <returns>Sorted list of category clusters.</returns>
    public static List<List<SolverPlace>> Form(IEnumerable<SolverPlace> places)
    {
        return Sort(Group(places));
    }
}

internal static class IfCandidateSelector
{
    /// <summary>
    /// New distance after removing one edge and adding two new edges.
    /// </summary>
    private static double NextDistance(
        IReadOnlyList<SolverPlace> seq, SolverPlace place, IDistanceFunc distFn, double currDist, int seqIdx)
    {
        return currDist
            - distFn.GetDistance(seq[seqIdx - 1].idx, seq[seqIdx].idx)
            + distFn.GetDistance(seq[seqIdx - 1].idx, place.idx)
            + distFn.GetDistance(place.idx,           seq[seqIdx].idx);
    }

    /// <summary>
    /// Select the best candidate out of all available places.
    /// </summary>
    public static (SolverPlace, double, int) SelectBest(
        IReadOnlyList<SolverPlace> seq, IReadOnlyList<SolverPlace> cat, IDistanceFunc distFn, double currDist)
    {
        /* WLOG, `currDist` can be 0.0. We return new distance to simplify the
         * caller's body. */

        (SolverPlace best, double lastDist, int seqIdx) = (null, double.MaxValue, -1);

        foreach (var place in cat)
        {
            for (int i = 1 /* source is skipped */; i < seq.Count; ++i)
            {
                var candDist = NextDistance(seq, place, distFn, currDist, i);

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
/// The Infrequent-First Heuristic (https://doi.org/10.1145/1463434.1463449).
/// </summary>
internal sealed class IfHeuristic
{
    /// <summary></summary>
    /// <param name="places">All available places (without source and target).</param>
    /// <param name="distFn">Distance matrix.</param>
    /// <param name="source">Starting place.</param>
    /// <param name="target">Destination.</param>
    /// <returns>Sequence.</returns>
    public static List<SolverPlace> Advise(
        IEnumerable<SolverPlace> places, IDistanceFunc distFn, SolverPlace source, SolverPlace target)
    {
        var seq = new List<SolverPlace>() { source, target };
        var currDist = distFn.GetDistance(source.idx, target.idx);

        var cats = IfCategoryFormer.Form(places);

        foreach (var cat in cats)
        {
            var (best, nextDist, seqIdx) = IfCandidateSelector
                .SelectBest(seq, cat, distFn, currDist);

            /*
             * This check does nothing _as long as_ we do not limit the
             * distance and do not consider arrows. Categories are non-empty,
             * and at least one place is always selected.
             */

            if (best is null) { break; } // no candidates left!

            currDist = nextDist;
            seq.Insert(seqIdx, best);
        }

        return seq;
    }
}
