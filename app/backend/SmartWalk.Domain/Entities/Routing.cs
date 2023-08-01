using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SmartWalk.Domain.Entities;

public sealed class ShortestPath
{
    /// <summary>
    /// Distance of the route in <b>meters</b>.
    /// </summary>
    [Required]
    [Range(0, double.MaxValue)]
    public double distance { get; set; }

    /// <summary>
    /// Duration of the route in <b>seconds</b>.
    /// </summary>
    [Required]
    [Range(0, double.MaxValue)]
    public double duration { get; set; }

    /// <summary>
    /// Ordered sequence of points representing connected linestring.
    /// </summary>
    [Required]
    public List<WgsPoint> polyline { get; set; }
}
