using System.Collections.Generic;
using SmartWalk.Core.Entities;
using SmartWalk.Core.Interfaces;

namespace SmartWalk.Core.Solvers;

public partial class SolverFactory
{
    internal abstract class SolverBase : ISolver
    {
        protected SolverFactory f { get; set; }

        /// <param name="f">Factory with bounded class members.</param>
        protected SolverBase(SolverFactory f)
        {
            this.f = f;
        }

        public abstract List<SolverPlace> Solve(IEnumerable<SolverPlace> places);
    }
}
