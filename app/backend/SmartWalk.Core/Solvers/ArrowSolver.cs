using System.Collections.Generic;
using SmartWalk.Core.Entities;
using SmartWalk.Core.Heuristics;

namespace SmartWalk.Core.Solvers;

public partial class SolverFactory
{
    internal sealed class ArrowSolver : SolverBase
    {
        /// <param name="f">Factory with bounded class members.</param>
        public ArrowSolver(SolverFactory f)
            : base(f)
        {
        }

        public override List<SolverPlace> Solve(IEnumerable<SolverPlace> places)
        {
            return OgHeuristic.Advise(places, f.distFn, f.arrows, f.source, f.target);
        }
    }
}
