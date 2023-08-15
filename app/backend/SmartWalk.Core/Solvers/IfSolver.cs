using System.Collections.Generic;
using SmartWalk.Core.Heuristics;
using SmartWalk.Domain.Entities;
using SmartWalk.Domain.Interfaces;

namespace SmartWalk.Core.Solvers;

internal sealed class IfSolver : HeuristicSolverBase, ISolver
{
    protected override List<SolverPlace> SolveImpl(
        List<SolverPlace> places, IDistanceMatrix distMatrix, List<PrecedenceEdge> precedence, int catsCount)
    {
        var precMatrix = new ListPrecedenceMatrix(
            new TransitiveClosure(catsCount, precedence).Closure(), precedence.Count);

        return IfHeuristic.Advise(places, distMatrix, precMatrix);
    }
}
