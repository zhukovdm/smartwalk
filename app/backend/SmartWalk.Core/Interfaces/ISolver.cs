using System.Collections.Generic;
using SmartWalk.Core.Entities;

namespace SmartWalk.Core.Interfaces;

public interface ISolver
{
    /// <summary>
    /// Given places and a distance matrix, construct a sequence of places that
    /// satisfies a precedence graph and does not exceed maximum distance.
    /// </summary>
    /// <param name="places">A collection of available places.</param>
    /// <returns>The first place (source), waypoints in-between, the last place (target).</returns>
    List<SolverPlace> Solve(IEnumerable<SolverPlace> places);
}
