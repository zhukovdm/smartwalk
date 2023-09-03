using System.Collections.Generic;
using SmartWalk.Core.Heuristics;
using SmartWalk.Domain.Entities;
using SmartWalk.Domain.Interfaces;

namespace SmartWalk.Core.Solvers;

internal sealed class IfSolver : HeuristicSolverBase, ISolver
{
    internal static IPrecedenceMatrix GetPrecedenceMatrix(IReadOnlyList<PrecedenceEdge> precedence, int catsCount, int sourceCat, int targetCat)
    {
        var closure = TransitiveClosure
            .Closure(ListPrecedenceMatrix.GetPrecedence(precedence, catsCount));

        return new ListPrecedenceMatrix(closure, precedence.Count, sourceCat, targetCat);
    }

    protected override List<SolverPlace> SolveImpl(
        SolverPlace source, SolverPlace target, IEnumerable<SolverPlace> places, IDistanceMatrix distMatrix, IPrecedenceMatrix precMatrix)
    {
        return IfHeuristic.Advise(source, target, places, distMatrix, precMatrix);
    }
}
