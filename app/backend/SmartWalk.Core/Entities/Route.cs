using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SmartWalk.Core.Entities;

public sealed class Arrow
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

    public Arrow(int fr, int to) { this.fr = fr; this.to = to; }
}

public sealed class Waypoint
{
    /// <example>64c91f8359914b93b23b01d9</example>
    [Required]
    public string smartId { get; }

    /// <example>0</example>
    [Required]
    public int category { get; }

    public Waypoint(string smartId, int category) { this.smartId = smartId; this.category = category; }
}

public sealed class Route
{
    /// <summary>
    /// Ordered sequence of points representing connected linestring.
    /// </summary>
    [Required]
    public Path path { get; init; }

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
    public List<Waypoint> waypoints { get; init; }
}
