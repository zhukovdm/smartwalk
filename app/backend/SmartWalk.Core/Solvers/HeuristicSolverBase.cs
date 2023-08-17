using System.Collections.Generic;
using SmartWalk.Core.Heuristics;
using SmartWalk.Domain.Entities;
using SmartWalk.Domain.Interfaces;

namespace SmartWalk.Core.Solvers;

internal abstract class HeuristicSolverBase : ISolver
{
    protected HeuristicSolverBase() { }

    protected abstract List<SolverPlace> SolveImpl(
        List<SolverPlace> places, IDistanceMatrix distMatrix, IPrecedenceMatrix precMatrix);

    public List<SolverPlace> Solve(
        List<SolverPlace> places, IDistanceMatrix distMatrix, IPrecedenceMatrix precMatrix)
    {
        var seq = SolveImpl(places, distMatrix, precMatrix);

        if (precMatrix.EsCount == 0)
        {
            seq = TwoOptHeuristic.Refine(seq, distMatrix);
        }
        return seq;
    }
}
