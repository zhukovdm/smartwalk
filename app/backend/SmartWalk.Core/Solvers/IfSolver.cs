using System.Collections.Generic;
using SmartWalk.Core.Heuristics;
using SmartWalk.Domain.Entities;
using SmartWalk.Domain.Interfaces;

namespace SmartWalk.Core.Solvers;

internal sealed class IfSolver : HeuristicSolverBase, ISolver
{
    protected override List<SolverPlace> SolveImpl(
        List<SolverPlace> solverPlaces, IDistanceMatrix distMatrix, List<PrecedenceEdge> precedence, int catCount)
    {
        var precMatrix = new ListPrecedenceMatrix(
            new TransitiveClosure(catCount, precedence).Closure(), precedence.Count);

        return IfHeuristic.Advise(solverPlaces, distMatrix, precMatrix);
    }
}
