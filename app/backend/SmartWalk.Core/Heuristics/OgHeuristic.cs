using System.Collections.Generic;
using System.Linq;
using SmartWalk.Domain.Entities;
using SmartWalk.Domain.Interfaces;

namespace SmartWalk.Core.Heuristics;

internal sealed class OgCategory
{
    /// <summary>
    /// Identifier of the original category.
    /// </summary>
    public int Id { get; init; }

    /// <summary>
    /// Count of predecessors.
    /// </summary>
    public int Pred { get; set; } = 0;

    /// <summary>
    /// The set of successors.
    /// </summary>
    public SortedSet<int> Succ { get; } = new();

    /// <summary>
    /// Places belonging to this category.
    /// </summary>
    public List<SolverPlace> Places { get; } = new();
}

internal static class OgCategoryFormer
{
    /// <summary>
    /// Group places by category. For each category calculate number of its
    /// predecessors, and calculate explicit set of successor categories.
    /// </summary>
    public static SortedDictionary<int, OgCategory> Form(
        List<SolverPlace> solverPlaces, List<PrecedenceEdge> precedence)
    {
        var result = new SortedDictionary<int, OgCategory>();

        var ensureCat = (SortedDictionary<int, OgCategory> dict, int cat) =>
        {
            if (!dict.ContainsKey(cat)) { dict.Add(cat, new() { Id = cat }); }
        };

        foreach (var place in solverPlaces)
        {
            ensureCat(result, place.Cat);
            result[place.Cat].Places.Add(place);
        }

        foreach (var edge in precedence)
        {
            ensureCat(result, edge.fr);
            ensureCat(result, edge.to);

            if (result[edge.fr].Succ.Add(edge.to)) { ++result[edge.to].Pred; }
        }

        return result;
    }
}

internal static class OgCandidateFinder
{
    /// <summary>
    /// Given feasible categories, find the best place from some category that
    /// optimize the distance of the place from the last inserted place and
    /// straight line between the source and target.
    /// </summary>
    public static SolverPlace FindBest(
        List<SolverPlace> seq, List<OgCategory> cats, IDistanceMatrix distMatrix)
    {
        SolverPlace best = null;
        double lastDist = double.MaxValue;

        foreach (var cat in cats)
        {
            foreach (var place in cat.Places)
            {
                var candDist = distMatrix.GetDistance(seq[0].Idx, place.Idx)
                    + distMatrix.GetDistance(seq[^2].Idx, place.Idx)
                    + distMatrix.GetDistance(place.Idx, seq[^1].Idx);

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
        foreach (var succ in cats[catId].Succ) { --cats[succ].Pred; }
        cats.Remove(catId);
    }

    public static List<SolverPlace> Advise(
        List<SolverPlace> places, IDistanceMatrix distMatrix, List<PrecedenceEdge> precedence)
    {
        var seq = new List<SolverPlace>() { places[0], places[^1] };
        var cats = OgCategoryFormer.Form(places, precedence);

        while (cats.Count > 0)
        {
            var freeCats = cats.Select(kv => kv.Value).Where((cat, _) => cat.Pred == 0).ToList();
            var best = OgCandidateFinder.FindBest(seq, freeCats, distMatrix);

            if (best is null) { break; }

            seq.Insert(seq.Count - 1, best);
            RemoveCategory(cats, best.Cat);
        }

        return seq;
    }
}
