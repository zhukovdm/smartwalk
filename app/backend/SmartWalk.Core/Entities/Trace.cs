using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SmartWalk.Core.Entities;

public sealed class Trace
{
    /// <summary>
    /// Crow-fly distance of the trace in <b>meters</b>.
    /// </summary>
    [Required]
    [Range(0.0, double.MaxValue)]
    public double distance { get; init; }

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
