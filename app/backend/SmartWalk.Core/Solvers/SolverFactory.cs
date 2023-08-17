using System.Collections.Generic;
using SmartWalk.Domain.Entities;
using SmartWalk.Domain.Interfaces;

namespace SmartWalk.Core.Solvers;

public static class SolverFactory
{
    /// <summary>
    /// <b>Solver-specific</b> precedence matrix.
    /// </summary>
    public static IPrecedenceMatrix GetPrecedenceMatrix(int catsCount, List<PrecedenceEdge> precedence)
        => IfSolver.GetPrecedenceMatrix(catsCount, precedence);

    public static ISolver GetSolver() => new IfSolver();
}
