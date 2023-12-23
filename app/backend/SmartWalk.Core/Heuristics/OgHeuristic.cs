using System.Collections.Generic;
using System.Linq;
using SmartWalk.Core.Entities;
using SmartWalk.Core.Interfaces;

namespace SmartWalk.Core.Heuristics;

internal sealed class OgCategory
{
    /// <summary>
    /// Number of predecessors.
    /// </summary>
    public int pred { get; set; } = 0;

    /// <summary>
    /// The set of successors.
    /// </summary>
    public SortedSet<int> succ { get; } = new();

    /// <summary>
    /// Places belonging to this category.
    /// </summary>
    public List<SolverPlace> places { get; } = new();
}

internal static class OgCategoryFormer
{
    /// <summary>
    /// Group places by category. For each category calculate number of its
    /// predecessors, and calculate explicit set of successor categories.
    /// </summary>
    /// <param name="places">Places to be categorized.</param>
    /// <param name="arrows">Category constraints.</param>
    /// <returns></returns>
    public static SortedDictionary<int, OgCategory> Form(
        IEnumerable<SolverPlace> places, IEnumerable<Arrow> arrows)
    {
        var result = new SortedDictionary<int, OgCategory>();

        var ensureCat = (SortedDictionary<int, OgCategory> dict, int cat) =>
        {
            if (!dict.ContainsKey(cat)) { dict.Add(cat, new()); }
        };

        // group places by category

        foreach (var place in places)
        {
            ensureCat(result, place.cat);
            result[place.cat].places.Add(place);
        }

        // add arrows between categories

        foreach (var arrow in arrows)
        {
            var fr = arrow.fr;
            var to = arrow.to;

            ensureCat(result, fr);
            ensureCat(result, to);

            if (result[fr].succ.Add(to)) { ++result[to].pred; }
        }
        return result;
    }
}

internal static class OgCandidateSelector
{
    /// <summary>
    /// Given unconstrained categories, find the best place from some category
    /// that optimize the distance of the place from the last inserted place
    /// and straight line between the source and target.
    /// </summary>
    /// <param name="seq">Current sequence.</param>
    /// <param name="freeCats">Unconstrained categories.</param>
    /// <param name="distFn">Distance function.</param>
    /// <returns></returns>
    public static SolverPlace SelectBest(
        List<SolverPlace> seq, IEnumerable<OgCategory> freeCats, IDistanceFunction distFn)
    {
        SolverPlace best = null;
        double lastDist = double.MaxValue;

        foreach (var cat in freeCats)
        {
            foreach (var place in cat.places)
            {
                var candDist = 0.0
                    + distFn.GetDistance(seq[ 0].idx, place.idx)
                    + distFn.GetDistance(seq[^2].idx, place.idx)
                    + distFn.GetDistance(place.idx, seq[^1].idx);

                if (candDist < lastDist)
                {
                    best = place;
                    lastDist = candDist;
                }
            }
        }
        return best;
    }
}

/// <summary>
/// The Oriented Greedy Heuristic (https://doi.org/10.14778/1920841.1920861).
/// </summary>
internal static class OgHeuristic
{
    /// <summary></summary>
    /// <param name="cats">Category collection.</param>
    /// <param name="catId">Identifier of the category to be removed.</param>
    private static void RemoveCategory(SortedDictionary<int, OgCategory> cats, int catId)
    {
        foreach (var succ in cats[catId].succ) { --cats[succ].pred; }
        cats.Remove(catId);
    }

    /// <summary></summary>
    /// <param name="places">All available places (without source and target).</param>
    /// <param name="distFn">Distance function.</param>
    /// <param name="arrows">Arrows forming valid directed acyclic graph.</param>
    /// <param name="source">Starting point.</param>
    /// <param name="target">Destination.</param>
    /// <returns></returns>
    public static List<SolverPlace> Advise(
        IEnumerable<SolverPlace> places, IDistanceFunction distFn, IEnumerable<Arrow> arrows, SolverPlace source, SolverPlace target)
    {
        var seq = new List<SolverPlace>() { source, target };
        var cats = OgCategoryFormer.Form(places, arrows);

        while (cats.Count > 0)
        {
            var freeCats = cats.Select(kv => kv.Value).Where((cat, _) => cat.pred == 0);
            var best = OgCandidateSelector.SelectBest(seq, freeCats, distFn);

            /*
             * This check eliminates empty categories that were created due
             * to the arrow configuration, see OgCategoryFormer for details.
             */

            if (best is null) { break; }

            seq.Insert(seq.Count - 1, best);
            RemoveCategory(cats, best.cat);
        }
        return seq;
    }
}
