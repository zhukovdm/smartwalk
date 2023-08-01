using System.Collections.Generic;
using System.Linq;
using SmartWalk.Core.Entities;
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
    public static SortedDictionary<int, OgCategory> Form(IReadOnlyList<SolverPlace> places, List<PrecedenceEdge> precedence)
    {
        var result = new SortedDictionary<int, OgCategory>();

        var ensureKey = (SortedDictionary<int, OgCategory> dict, int key) =>
        {
            if (!dict.ContainsKey(key)) { dict.Add(key, new() { Id = key }); }
        };

        foreach (var place in places)
        {
            ensureKey(result, place.Category);
            result[place.Category].Places.Add(place);
        }

        foreach (var prec in precedence)
        {
            ensureKey(result, prec.fr);
            ensureKey(result, prec.to);

            if (result[prec.fr].Succ.Add(prec.to)) { ++result[prec.to].Pred; }
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
    public static (SolverPlace, double) FindBest(
        IReadOnlyList<int> seq, IReadOnlyList<OgCategory> cats, IDistanceMatrix matrix, double currDist)
    {
        SolverPlace best = null;
        double nextDist = double.MaxValue;
        double lastDist = double.MaxValue;

        foreach (var cat in cats)
        {
            foreach (var place in cat.Places)
            {
                var candDist = matrix.Distance(seq[0], place.Index)
                    + matrix.Distance(seq[^2], place.Index)
                    + matrix.Distance(place.Index, seq[^1]);

                if (candDist < lastDist)
                {
                    best = place;
                    lastDist = candDist;
                    nextDist = DistanceAdjuster.NextDistance(seq, matrix, place, currDist, seq.Count - 1);
                }
            }
        }

        return (best, nextDist);
    }
}

/// <summary>
/// Oriented Greedy Heuristic from https://doi.org/10.14778/1920841.1920861.
/// </summary>
internal static class OgHeuristic
{
    private static void RemoveCategory(SortedDictionary<int, OgCategory> cats, int catId)
    {
        foreach (var succ in cats[catId].Succ) { --cats[succ].Pred; }
        cats.Remove(catId);
    }

    /// <summary>
    /// Advise a route.
    /// </summary>
    /// <param name="precedence">Edges of the acyclic precedence graph.</param>
    public static List<int> Advise(
        IReadOnlyList<SolverPlace> places, IDistanceMatrix matrix, List<PrecedenceEdge> precedence, double maxDist, int placesCount)
    {
        var seq = new List<int>() { 0, placesCount - 1 };
        var currDist = matrix.Distance(0, placesCount - 1);

        var cats = OgCategoryFormer.Form(places, precedence);

        while (cats.Count > 0)
        {
            var freeCats = cats.Select(kv => kv.Value).Where((cat, _) => cat.Pred == 0).ToList();
            var (best, nextDist) = OgCandidateFinder.FindBest(seq, freeCats, matrix, currDist);

            if (best is not null && nextDist <= maxDist * 1.0)
            {
                currDist = nextDist;
                seq.Insert(seq.Count - 1, best.Index);
                RemoveCategory(cats, best.Category);
            }

            /* Nonexistent suitable candidate means that all free categories
             * are no longer relevant and shall be removed. */

            else
            {
                foreach (var cat in freeCats) { RemoveCategory(cats, cat.Id); }
            }
        }

        return seq;
    }
}
