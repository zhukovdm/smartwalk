using System.Collections.Generic;
using SmartWalk.Domain.Entities;
using SmartWalk.Domain.Interfaces;

namespace SmartWalk.Core.Heuristics;

/// <summary>
/// 2-Opt Heuristic for TSP performed on <b>open</b> routes.
/// <list type="bullet">
/// <item>https://en.wikipedia.org/wiki/2-opt</item>
/// </list>
/// </summary>
internal static class TwoOptHeuristic
{
    /// <summary>
    /// Used as a refinement step for routes without precedence constraints.
    /// The first and last items are never swapped.
    /// </summary>
    public static List<SolverPlace> Refine(List<SolverPlace> seq, IDistanceMatrix matrix)
    {
        bool change;
        do
        {
            change = false;

            for (int i = 0; i < seq.Count - 3; ++i)
            {
                for (int j = i + 1; j < seq.Count - 2; ++j)
                {
                    double diff = 0.0
                        - matrix.GetDistance(seq[i    ].Idx, seq[i + 1].Idx)
                        - matrix.GetDistance(seq[j    ].Idx, seq[j + 1].Idx)
                        + matrix.GetDistance(seq[i    ].Idx, seq[j    ].Idx)
                        + matrix.GetDistance(seq[i + 1].Idx, seq[j + 1].Idx);

                    if (diff < -1.0)
                    {
                        change = true;
                        seq.Reverse(i + 1, j - i);
                    }
                }
            }
        } while (change);

        return seq;
    }
}
