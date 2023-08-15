using System.Collections.Generic;
using SmartWalk.Core.Heuristics;
using SmartWalk.Domain.Entities;
using SmartWalk.Domain.Interfaces;

namespace SmartWalk.Core.Solvers;

internal sealed class OgSolver : HeuristicSolverBase, ISolver
{
    protected override List<SolverPlace> SolveImpl(
        List<SolverPlace> places, IDistanceMatrix distMatrix, List<PrecedenceEdge> precedence, int _)
    {
        return OgHeuristic.Advise(places, distMatrix, precedence);
    }
}
