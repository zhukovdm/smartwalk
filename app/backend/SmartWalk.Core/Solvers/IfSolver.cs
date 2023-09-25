using System.Collections.Generic;
using SmartWalk.Core.Heuristics;
using SmartWalk.Domain.Entities;
using SmartWalk.Domain.Interfaces;

namespace SmartWalk.Core.Solvers;

internal sealed class IfSolver : HeuristicSolverBase, ISolver
{
    internal static IPrecedenceMatrix GetPrecedenceMatrix(IReadOnlyList<PrecedenceEdge> precedence, int catsCount, bool hasNonTerminalEdges)
    {
        var closure = TransitiveClosure
            .Closure(ListPrecedenceMatrix.GetLists(precedence, catsCount));

        return new ListPrecedenceMatrix(closure, hasNonTerminalEdges);
    }

    protected override List<SolverPlace> SolveImpl(
        SolverPlace source, SolverPlace target, IEnumerable<SolverPlace> places, IDistanceMatrix distMatrix, IPrecedenceMatrix precMatrix)
    {
        return IfHeuristic.Advise(source, target, places, distMatrix, precMatrix);
    }
}
