using System.Collections.Generic;
using SmartWalk.Core.Entities;
using SmartWalk.Core.Heuristics;

namespace SmartWalk.Core.Solvers;

public partial class SolverFactory
{
    internal sealed class FloatSolver : SolverBase
    {
        /// <summary></summary>
        /// <param name="f">Factory with bounded class members.</param>
        public FloatSolver(SolverFactory f) : base(f) { }

        public override List<SolverPlace> Solve(IEnumerable<SolverPlace> places)
        {
            var seq = IfHeuristic.Advise(places, f.distFn, f.source, f.target);
            return TwoOptHeuristic.Advise(seq, f.distFn);
        }
    }
}
