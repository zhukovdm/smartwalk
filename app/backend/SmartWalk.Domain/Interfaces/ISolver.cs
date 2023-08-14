using System.Collections.Generic;
using SmartWalk.Domain.Entities;

namespace SmartWalk.Domain.Interfaces;

public interface ISolver
{
    /// <summary>
    /// Given places and a distance matrix, construct a sequence of places that
    /// satisfies a precedence graph and does not exceed maximum distance.
    /// </summary>
    List<SolverPlace> Solve(List<SolverPlace> places, IDistanceMatrix matrix, List<PrecedenceEdge> precedence, double maxDistance);
}
