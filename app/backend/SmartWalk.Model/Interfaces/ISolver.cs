using System.Collections.Generic;
using SmartWalk.Model.Entities;

namespace SmartWalk.Model.Interfaces;

public interface ISolver
{
    /// <summary>
    /// Given places and a distance matrix, construct a sequence of places that
    /// satisfies a precedence graph and does not exceed maximum distance.
    /// </summary>
    /// <param name="source">Starting point</param>
    /// <param name="target">Destination</param>
    /// <param name="places">Sequence of places, the first and last are always source and target respectively.</param>
    /// <param name="distMatrix">Matrix of distances between original places.</param>
    /// <param name="precMatrix">Edges of a category precedence graph (or its transitive closure).</param>
    /// <returns>The first place (source), waypoints in-between, the last place (target).</returns>
    List<SolverPlace> Solve(
        SolverPlace source, SolverPlace target, IEnumerable<SolverPlace> places, IDistanceMatrix distMatrix, IPrecedenceMatrix precMatrix);
}
