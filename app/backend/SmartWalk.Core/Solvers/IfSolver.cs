using System.Collections.Generic;
using SmartWalk.Core.Algorithms;
using SmartWalk.Core.Entities;
using SmartWalk.Core.Heuristics;
using SmartWalk.Core.Interfaces;

namespace SmartWalk.Core.Solvers;

internal sealed class IfSolver : HeuristicSolverBase, ISolver
{
    internal static IPrecedenceMatrix GetPrecedenceMatrix(IEnumerable<PrecedenceEdge> edges, int catsCount, bool hasArrows)
    {
        var closure = TransitiveClosure
            .Closure(ListPrecedenceMatrix.GetLists(edges, catsCount));

        return new ListPrecedenceMatrix(closure, hasArrows);
    }

    protected override List<SolverPlace> SolveImpl(
        SolverPlace source, SolverPlace target, IEnumerable<SolverPlace> places, IDistanceMatrix distMatrix, IPrecedenceMatrix precMatrix)
    {
        return IfHeuristic.Advise(source, target, places, distMatrix, precMatrix);
    }
}
