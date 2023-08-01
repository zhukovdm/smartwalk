using System.Collections.Generic;
using SmartWalk.Core.Entities;
using SmartWalk.Domain.Interfaces;

namespace SmartWalk.Core.Heuristics;

internal static class DistanceAdjuster
{
    public static double NextDistance(
        IReadOnlyList<int> seq, IDistanceMatrix matrix, SolverPlace place, double currDist, int index)
    {
        return currDist
            - matrix.Distance(seq[index - 1], seq[index])
            + matrix.Distance(seq[index - 1], place.Index)
            + matrix.Distance(place.Index, seq[index]);
    }
}
