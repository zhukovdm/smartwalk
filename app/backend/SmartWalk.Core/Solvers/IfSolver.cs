using System.Collections.Generic;
using SmartWalk.Core.Heuristics;
using SmartWalk.Model.Entities;
using SmartWalk.Model.Interfaces;

namespace SmartWalk.Core.Solvers;

internal sealed class IfSolver : HeuristicSolverBase, ISolver
{
    internal static IPrecedenceMatrix GetPrecedenceMatrix(IReadOnlyList<PrecedenceEdge> precedence, int catsCount, bool hasArrows)
    {
        var closure = TransitiveClosure
            .Closure(ListPrecedenceMatrix.GetLists(precedence, catsCount));

        return new ListPrecedenceMatrix(closure, hasArrows);
    }

    protected override List<SolverPlace> SolveImpl(
        SolverPlace source, SolverPlace target, IEnumerable<SolverPlace> places, IDistanceMatrix distMatrix, IPrecedenceMatrix precMatrix)
    {
        return IfHeuristic.Advise(source, target, places, distMatrix, precMatrix);
    }
}
