using System.Collections.Generic;
using SmartWalk.Core.Heuristics;
using SmartWalk.Model.Entities;
using SmartWalk.Model.Interfaces;

namespace SmartWalk.Core.Solvers;

internal sealed class OgSolver : HeuristicSolverBase, ISolver
{
    internal static IPrecedenceMatrix GetPrecedenceMatrix(IEnumerable<PrecedenceEdge> precedence, int catsCount, bool hasArrows)
    {
        return new ListPrecedenceMatrix(
            ListPrecedenceMatrix.GetLists(precedence, catsCount), hasArrows);
    }

    protected override List<SolverPlace> SolveImpl(
        SolverPlace source, SolverPlace target, IEnumerable<SolverPlace> places, IDistanceMatrix distMatrix, IPrecedenceMatrix precMatrix)
    {
        return OgHeuristic.Advise(source, target, places, distMatrix, precMatrix);
    }
}
