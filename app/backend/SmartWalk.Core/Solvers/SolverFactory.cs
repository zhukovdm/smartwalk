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
     //

    /// <summary>
    /// <b>Solver-specific</b> precedence matrix.
    /// </summary>
    /// <param name="hasNonTerminalEdges">
    /// Set <c>true</c> if the matrix has at least one edge with both vertices
    /// different from the source and target.
    /// </param>
    public static IPrecedenceMatrix GetPrecedenceMatrix(
        IEnumerable<PrecedenceEdge> precedence, int catsCount, bool hasNonTerminalEdges)
    {
        // return IfSolver.GetPrecedenceMatrix(precedence, catsCount, hasNonTerminalEdges);
        return OgSolver.GetPrecedenceMatrix(precedence, catsCount, hasNonTerminalEdges);
    }
    public static ISolver GetSolver()
    {
        // return new IfSolver();
        return new OgSolver();
    }
}
