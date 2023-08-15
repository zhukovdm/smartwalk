using System.Collections.Generic;
using SmartWalk.Core.Heuristics;
using SmartWalk.Domain.Entities;
using SmartWalk.Domain.Interfaces;

namespace SmartWalk.Core.Solvers;

internal abstract class HeuristicSolverBase : ISolver
{
    protected HeuristicSolverBase() { }

    protected abstract List<SolverPlace> SolveImpl(
        List<SolverPlace> places, IDistanceMatrix distMatrix, List<PrecedenceEdge> precedence, int catsCount);

    public List<SolverPlace> Solve(
        List<SolverPlace> places, IDistanceMatrix distMatrix, List<PrecedenceEdge> precedence, int catsCount)
    {
        var seq = SolveImpl(places, distMatrix, precedence, catsCount);

        if (precedence.Count == 0)
        {
            seq = TwoOptHeuristic.Refine(seq, distMatrix);
        }
        return seq;
    }
}