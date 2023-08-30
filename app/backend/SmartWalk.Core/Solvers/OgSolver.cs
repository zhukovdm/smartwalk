using System.Collections.Generic;
using SmartWalk.Core.Heuristics;
using SmartWalk.Domain.Entities;
using SmartWalk.Domain.Interfaces;

namespace SmartWalk.Core.Solvers;

internal sealed class OgSolver : HeuristicSolverBase, ISolver
{
    internal static IPrecedenceMatrix GetPrecedenceMatrix(IReadOnlyList<PrecedenceEdge> precedence, int catsCount)
    {
        return new ListPrecedenceMatrix(
            ListPrecedenceMatrix.GetPrecedence(precedence, catsCount), precedence.Count);
    }

    protected override List<SolverPlace> SolveImpl(
        SolverPlace source, SolverPlace target, IEnumerable<SolverPlace> places, IDistanceMatrix distMatrix, IPrecedenceMatrix precMatrix)
    {
        return OgHeuristic.Advise(source, target, places, distMatrix, precMatrix);
    }
}
