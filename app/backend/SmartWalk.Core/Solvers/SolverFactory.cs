using System.Collections.Generic;
using SmartWalk.Core.Entities;
using SmartWalk.Core.Interfaces;

namespace SmartWalk.Core.Solvers;

public static class SolverFactory
{
    /*
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
    /// <param name="edges"></param>
    /// <param name="catsCount"></param>
    /// <param name="hasArrows">
    /// Set <c>true</c> if the matrix has at least one edge with both vertices
    /// different from the source and target.
    /// </param>
    public static IPrecedenceMatrix GetPrecedenceMatrix(
        IEnumerable<PrecedenceEdge> edges, int catsCount, bool hasArrows)
    {
    //  return IfSolver.GetPrecedenceMatrix(edges, catsCount, hasArrows);
        return OgSolver.GetPrecedenceMatrix(edges, catsCount, hasArrows);
    }
    public static ISolver GetSolver()
    {
    //  return new IfSolver();
        return new OgSolver();
    }
}
