using System.Collections.Generic;
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
    /// The first
    /// and last items are not swappable. Used as a refinement step for routes
    /// without precedence constraints.
    /// </summary>
    public static List<int> Refine(List<int> route, IDistanceMatrix matrix)
    {
        bool change;
        do
        {
            change = false;

            for (int i = 0; i < route.Count - 3; ++i)
            {
                for (int j = i + 1; j < route.Count - 2; ++j)
                {
                    double diff = 0.0
                        - matrix.Distance(route[i    ], route[i + 1])
                        - matrix.Distance(route[j    ], route[j + 1])
                        + matrix.Distance(route[i    ], route[j    ])
                        + matrix.Distance(route[i + 1], route[j + 1]);

                    if (diff < 0)
                    {
                        change = true; route.Reverse(i + 1, j - i);
                    }
                }
            }
        } while (change);

        return route;
    }
}
