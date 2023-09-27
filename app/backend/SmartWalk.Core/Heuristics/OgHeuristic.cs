using System.Collections.Generic;
using System.Linq;
using SmartWalk.Domain.Entities;
using SmartWalk.Domain.Interfaces;

namespace SmartWalk.Core.Heuristics;

internal sealed class OgCategory
{
    /// <summary>
    /// Category identifier.
    /// </summary>
    public int cid { get; init; }

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
    public static SortedDictionary<int, OgCategory> Form(
        IEnumerable<SolverPlace> solverPlaces, IPrecedenceMatrix precMatrix, int sourceCat, int targetCat)
    {
        var result = new SortedDictionary<int, OgCategory>();

        var ensureCat = (SortedDictionary<int, OgCategory> dict, int cat) =>
        {
            if (!dict.ContainsKey(cat)) { dict.Add(cat, new() { cid = cat }); }
        };

        // group places by category

        foreach (var place in solverPlaces)
        {
            ensureCat(result, place.cat);
            result[place.cat].places.Add(place);
        }

        // remove source and target cats!

        result.Remove(sourceCat);
        result.Remove(targetCat);

        // add edges between categories (terminal edges are skipped!)

        for (int fr = 0; fr < precMatrix.CsCount; ++fr)
        {
            for (int to = 0; to < precMatrix.CsCount; ++to)
            {
                if (fr != sourceCat && to != targetCat && precMatrix.IsBefore(fr, to))
                {
                    ensureCat(result, fr);
                    ensureCat(result, to);

                    if (result[fr].succ.Add(to)) { ++result[to].pred; }
                }
            }
        }

        return result;
    }
}

internal static class OgCandidateSelector
{
    /// <summary>
    /// Given feasible categories, find the best place from some category that
    /// optimize the distance of the place from the last inserted place and
    /// straight line between the source and target.
    /// </summary>
    public static SolverPlace SelectBest(
        List<SolverPlace> seq, IEnumerable<OgCategory> cats, IDistanceMatrix distMatrix)
    {
        SolverPlace best = null;
        double lastDist = double.MaxValue;

        foreach (var cat in cats)
        {
            foreach (var place in cat.places)
            {
                var candDist = 0.0
                    + distMatrix.GetDistance(seq[ 0].idx, place.idx)
                    + distMatrix.GetDistance(seq[^2].idx, place.idx)
                    + distMatrix.GetDistance(place.idx, seq[^1].idx);

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
    private static void RemoveCategory(SortedDictionary<int, OgCategory> cats, int catId)
    {
        foreach (var succ in cats[catId].succ) { --cats[succ].pred; }
        cats.Remove(catId);
    }

    public static List<SolverPlace> Advise(
        SolverPlace source, SolverPlace target, IEnumerable<SolverPlace> places, IDistanceMatrix distMatrix, IPrecedenceMatrix precMatrix)
    {
        var seq = new List<SolverPlace>() { source, target };
        var cats = OgCategoryFormer.Form(places, precMatrix, source.cat, target.cat);

        while (cats.Count > 0)
        {
            var freeCats = cats.Select(kv => kv.Value).Where((cat, _) => cat.pred == 0);
            var best = OgCandidateSelector.SelectBest(seq, freeCats, distMatrix);

            if (best is null) { break; }

            seq.Insert(seq.Count - 1, best);
            RemoveCategory(cats, best.cat);
        }

        return seq;
    }
}
