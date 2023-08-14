using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SmartWalk.Domain.Entities;

public sealed class PrecedenceEdge
{
    /// <summary>
    /// Source category.
    /// </summary>
    [Required]
    public int fr { get; }

    /// <summary>
    /// Target category.
    /// </summary>
    [Required]
    public int to { get; }

    public PrecedenceEdge(int fr, int to) { this.fr = fr; this.to = to; }
}

public sealed class Route
{
    /// <summary>
    /// Ordered sequence of points representing connected linestring.
    /// </summary>
    [Required]
    public ShortestPath path { get; init; }

    /// <summary>
    /// Unordered list of visited places.
    /// </summary>
    [Required]
    public List<Place> places { get; init; }

    /// <summary>
    /// Ordered sequence of visited waypoints, each represented by the
    /// corresponding smartId.
    /// </summary>
    [Required]
    public List<string> waypoints { get; init; }
}
