using System.Collections.Generic;
using SmartWalk.Core.Entities;
using SmartWalk.Core.Interfaces;

namespace SmartWalk.Core.Heuristics;

/// <summary>
/// 2-Opt Heuristic for TSP performed on <b>open</b> routes and <b>symmetric</b>
/// distance matrix.
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
    public static List<SolverPlace> Refine(List<SolverPlace> seq, IDistanceMatrix distMatrix)
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
                        - distMatrix.GetDistance(seq[i    ].idx, seq[i + 1].idx)
                        - distMatrix.GetDistance(seq[j    ].idx, seq[j + 1].idx)
                        + distMatrix.GetDistance(seq[i    ].idx, seq[j    ].idx)
                        + distMatrix.GetDistance(seq[i + 1].idx, seq[j + 1].idx);

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
