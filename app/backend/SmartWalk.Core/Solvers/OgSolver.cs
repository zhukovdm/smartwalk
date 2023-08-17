using System.Collections.Generic;
using SmartWalk.Core.Heuristics;
using SmartWalk.Domain.Entities;
using SmartWalk.Domain.Interfaces;

namespace SmartWalk.Core.Solvers;

internal sealed class OgSolver : HeuristicSolverBase, ISolver
{
    internal static IPrecedenceMatrix GetPrecedenceMatrix(int catsCount, List<PrecedenceEdge> precedence)
    {
        return new ListPrecedenceMatrix(
            ListPrecedenceMatrix.GetPrecedence(catsCount, precedence), precedence.Count);
    }

    protected override List<SolverPlace> SolveImpl(
        List<SolverPlace> places, IDistanceMatrix distMatrix, IPrecedenceMatrix precMatrix)
    {
        return OgHeuristic.Advise(places, distMatrix, precMatrix);
    }
}
