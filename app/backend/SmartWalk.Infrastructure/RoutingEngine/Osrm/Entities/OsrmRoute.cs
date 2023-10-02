using System.ComponentModel.DataAnnotations;
using GeoJSON.Text.Geometry;

namespace SmartWalk.Infrastructure.RoutingEngine.Osrm;

internal sealed class OsrmRoute
{
    /// <summary>
    /// Distance in <b>meters</b>.
    /// </summary>
    [Required]
    [Range(0, double.MaxValue)]
    public double? distance { get; init; }

    /// <summary>
    /// Duration in <b>seconds</b>.
    /// </summary>
    [Required]
    [Range(0, double.MaxValue)]
    public double? duration { get; init; }

    /// <summary>
    /// Shape as a GeoJSON object.
    /// </summary>
    [Required]
    public LineString geometry { get; init; }
}
