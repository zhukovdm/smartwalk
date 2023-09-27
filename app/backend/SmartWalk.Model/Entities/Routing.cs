using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SmartWalk.Model.Entities;

public sealed class ShortestPath
{
    /// <summary>
    /// Distance of the route in <b>meters</b>.
    /// </summary>
    /// <example>1234.56</example>
    [Required]
    [Range(0, double.MaxValue)]
    public double distance { get; init; }

    /// <summary>
    /// Duration of the route in <b>seconds</b>.
    /// </summary>
    /// <example>300.00</example>
    [Required]
    [Range(0, double.MaxValue)]
    public double duration { get; init; }

    /// <summary>
    /// Ordered sequence of points representing connected linestring.
    /// </summary>
    [Required]
    public List<WgsPoint> polyline { get; init; }
}
