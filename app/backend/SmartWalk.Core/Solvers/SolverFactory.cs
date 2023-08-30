using System.Collections.Generic;
using SmartWalk.Domain.Entities;
using SmartWalk.Domain.Interfaces;

namespace SmartWalk.Core.Solvers;

public static class SolverFactory
{
    /**
     ***************************************************************************
     *
     *                  NOTE THAT THE PROCEDURE FOR FINDING
     *                 PRECEDENCE MATRIX IS SOLVER-DEPENDENT
     *
     ***************************************************************************
     */

    /// <summary>
    /// <b>Solver-specific</b> precedence matrix.
    /// </summary>
    public static IPrecedenceMatrix GetPrecedenceMatrix(IReadOnlyList<PrecedenceEdge> precedence, int catsCount)
    {
        // return IfSolver.GetPrecedenceMatrix(precedence, catsCount);
        return OgSolver.GetPrecedenceMatrix(precedence, catsCount);
    }

    public static ISolver GetSolver()
    {
        // return new IfSolver();
        return new OgSolver();
    }
}
