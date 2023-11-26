using System.Collections.Generic;
using SmartWalk.Core.Entities;
using SmartWalk.Core.Interfaces;

namespace SmartWalk.Core.Solvers;

public partial class SolverFactory
{
    readonly IDistanceFunction distFn;
    readonly IReadOnlyList<Arrow> arrows;
    readonly SolverPlace source, target;

    /// <summary></summary>
    /// <param name="distFn">Distance function defined for all pairs of places.</param>
    /// <param name="arrows">A valid list of arrows.</param>
    /// <param name="source">Starting point.</param>
    /// <param name="target">Destination.</param>
    public SolverFactory(IDistanceFunction distFn, IReadOnlyList<Arrow> arrows, SolverPlace source, SolverPlace target)
    {
        this.distFn = distFn;
        this.arrows = arrows;
        this.source = source;
        this.target = target;
    }

    /// <summary></summary>
    /// <returns>Standard solver based on arrow configuration.</returns>
    public ISolver GetSolver()
    {
        return (arrows.Count == 0) ? new FloatSolver(this) : new ArrowSolver(this);
    }
}
