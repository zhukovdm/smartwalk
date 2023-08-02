using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SmartWalk.Domain.Entities;

public sealed class Route
{
    /// <summary>
    /// Connect source, target, and waypoints in-between.
    /// </summary>
    [Required]
    public ShortestPath path { get; set; }

    /// <summary>
    /// Ordered sequence of places.
    /// </summary>
    [Required]
    public List<Place> waypoints { get; set; }
}

public sealed class PrecedenceEdge
{
    /// <summary>
    /// Category from.
    /// </summary>
    public int fr { get; set; }

    /// <summary>
    /// Category to.
    /// </summary>
    public int to { get; set; }
}
