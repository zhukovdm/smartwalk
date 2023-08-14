using System.Collections.Generic;
using SmartWalk.Domain.Entities;

namespace SmartWalk.Domain.Interfaces;

public interface ISolver
{
    /// <summary>
    /// Given places and a distance matrix, construct a sequence of places that
    /// satisfies a precedence graph and does not exceed maximum distance.
    /// </summary>
    /// <param name="solverPlaces">Sequence of places, the first and last are always source and target respectively.</param>
    /// <param name="matrix">Matrix of distances between original places.</param>
    /// <param name="precedence">Edges of a category precedence graph.</param>
    /// <returns>The first place (source), waypoints in-between, the last place (target).</returns>
    List<SolverPlace> Solve(
        List<SolverPlace> solverPlaces, IDistanceMatrix matrix, List<PrecedenceEdge> precedence);
}
