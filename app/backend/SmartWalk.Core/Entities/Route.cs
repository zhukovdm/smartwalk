using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SmartWalk.Core.Entities;

public sealed class Route
{
    /// <summary>
    /// Total crow-fly distance of visiting waypoints in the given order
    /// in <b>meters</b> multiplied by average detour index.
    /// </summary>
    [Required]
    [Range(0.0, double.MaxValue)]
    public double avgDistance { get; init; }

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
    /// corresponding smartId. Note that source and target are omitted.
    /// </summary>
    [Required]
    public List<Waypoint> waypoints { get; init; }
}
