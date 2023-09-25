using System.Collections.Generic;
using SmartWalk.Core.Heuristics;
using SmartWalk.Domain.Entities;
using SmartWalk.Domain.Interfaces;

namespace SmartWalk.Core.Solvers;

internal sealed class OgSolver : HeuristicSolverBase, ISolver
{
    internal static IPrecedenceMatrix GetPrecedenceMatrix(IEnumerable<PrecedenceEdge> precedence, int catsCount, bool hasNonTerminalEdges)
    {
        return new ListPrecedenceMatrix(
            ListPrecedenceMatrix.GetLists(precedence, catsCount), hasNonTerminalEdges);
    }

    protected override List<SolverPlace> SolveImpl(
        SolverPlace source, SolverPlace target, IEnumerable<SolverPlace> places, IDistanceMatrix distMatrix, IPrecedenceMatrix precMatrix)
    {
        return OgHeuristic.Advise(source, target, places, distMatrix, precMatrix);
    }
}
