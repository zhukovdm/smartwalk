using System.Collections.Generic;
using SmartWalk.Core.Entities;
using SmartWalk.Core.Interfaces;

namespace SmartWalk.Core.Heuristics;

/// <summary>
/// 2-Opt Heuristic for the TSP performed on paths and <b>symmetric</b>
/// distance functions.
/// <list type="bullet">
/// <item>https://en.wikipedia.org/wiki/2-opt</item>
/// </list>
/// </summary>
internal static class TwoOptHeuristic
{
    private static readonly double epsilon = 1E-03;

    /// <summary>
    /// Used as a refinement step for routes without precedence constraints.
    /// The first and last items in the sequence are never swapped.
    /// 
    /// The main idea is to find an improvement and reverse the segment between
    /// i and j+1, that is [i+1, _, ..., _, j]. Unfortunately, the standard array
    /// reverse is based on the segment length, and not indices.
    /// 
    /// <code>
    /// ... _ i i+1 _ _ _ _ _ j j+1 _ ...
    /// </code>
    /// </summary>
    /// <param name="seq">Unordered sequence of places.</param>
    /// <param name="distFn">Distance function.</param>
    /// <returns>Improved sequence.</returns>
    public static List<SolverPlace> Advise(List<SolverPlace> seq, IDistanceFunc distFn)
    {
        bool change;
        do
        {
            change = false;

            for (int i = 0; i < seq.Count - 2; ++i)
            {
                for (int j = i + 1; j < seq.Count - 1; ++j)
                {
                    double diff = 0.0
                        - distFn.GetDistance(seq[i    ].idx, seq[i + 1].idx)
                        - distFn.GetDistance(seq[j    ].idx, seq[j + 1].idx)
                        + distFn.GetDistance(seq[i    ].idx, seq[j    ].idx)
                        + distFn.GetDistance(seq[i + 1].idx, seq[j + 1].idx);

                    if (diff < -epsilon)
                    {
                        change = true;
                        seq.Reverse(i + 1, j - i); // !
                    }
                }
            }
        } while (change);

        return seq;
    }
}
