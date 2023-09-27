using System.ComponentModel.DataAnnotations;

namespace SmartWalk.Model.Entities;

/// <summary>
/// Representation of a point on an ellipsoidal body.
/// </summary>
public sealed class WgsPoint
{
    /// <example>0.0</example>
    [Required]
    [Range(-180.0, 180.0)]
    public double lon { get; }

    /// <example>0.0</example>
    [Required]
    [Range(-85.06, 85.06)]
    public double lat { get; }

    public WgsPoint(double lon, double lat) { this.lon = lon; this.lat = lat; }
}
