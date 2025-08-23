using System.Collections.Generic;
using SmartWalk.Core.Entities;
using SmartWalk.Core.Interfaces;

namespace SmartWalk.Core.Solvers;

public partial class SolverFactory
{
    private readonly IDistanceFunc distFn;
    private readonly IReadOnlyList<Arrow> arrows;
    private readonly SolverPlace source;
    private readonly SolverPlace target;

    /// <param name="distFn">Distance function defined for all pairs of places.</param>
    /// <param name="arrows">A valid list of arrows.</param>
    /// <param name="source">Starting point.</param>
    /// <param name="target">Destination.</param>
    public SolverFactory(IDistanceFunc distFn, IReadOnlyList<Arrow> arrows, SolverPlace source, SolverPlace target)
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
