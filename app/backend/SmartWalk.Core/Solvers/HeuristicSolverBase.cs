using System.Collections.Generic;
using SmartWalk.Core.Entities;
using SmartWalk.Core.Heuristics;
using SmartWalk.Core.Interfaces;

namespace SmartWalk.Core.Solvers;

internal abstract class HeuristicSolverBase : ISolver
{
    protected HeuristicSolverBase() { }

    protected abstract List<SolverPlace> SolveImpl(
        SolverPlace source, SolverPlace target, IEnumerable<SolverPlace> places, IDistanceMatrix distMatrix, IPrecedenceMatrix precMatrix);

    public List<SolverPlace> Solve(
        SolverPlace source, SolverPlace target, IEnumerable<SolverPlace> places, IDistanceMatrix distMatrix, IPrecedenceMatrix precMatrix)
    {
        var seq = SolveImpl(source, target, places, distMatrix, precMatrix);

        if (!precMatrix.HasArrows)
        {
            seq = TwoOptHeuristic.Refine(seq, distMatrix);
        }
        return seq;
    }
}
