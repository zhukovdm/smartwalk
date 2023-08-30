using System.Collections.Generic;
using SmartWalk.Core.Heuristics;
using SmartWalk.Domain.Entities;
using SmartWalk.Domain.Interfaces;

namespace SmartWalk.Core.Solvers;

internal sealed class IfSolver : HeuristicSolverBase, ISolver
{
    internal static IPrecedenceMatrix GetPrecedenceMatrix(int catsCount, List<PrecedenceEdge> precedence)
    {
        var closure = TransitiveClosure
            .Closure(ListPrecedenceMatrix.GetPrecedence(catsCount, precedence));

        return new ListPrecedenceMatrix(closure, precedence.Count);
    }

    protected override List<SolverPlace> SolveImpl(
        SolverPlace source, SolverPlace target, IEnumerable<SolverPlace> places, IDistanceMatrix distMatrix, IPrecedenceMatrix precMatrix)
    {
        return IfHeuristic.Advise(source, target, places, distMatrix, precMatrix);
    }
}
