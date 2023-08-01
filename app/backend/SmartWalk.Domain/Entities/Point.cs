using System.ComponentModel.DataAnnotations;

namespace SmartWalk.Domain.Entities;

/// <summary>
/// Representation of a point on an ellipsoidal body.
/// </summary>
public sealed class WgsPoint
{
    [Required]
    [Range(-180.0, 180.0)]
    public double lon { get; }

    [Required]
    [Range(-85.06, 85.06)]
    public double lat { get; }

    public WgsPoint(double lon, double lat) { this.lon = lon; this.lat = lat; }
}

/// <summary>
/// Representation of a point in EPSG:4326 restricted to the range of EPSG:3857.
/// See https://epsg.io/4326 and https://epsg.io/3857 for details.
/// </summary>
public sealed class WebPoint
{
    [Required]
    [Range(-180.0, 180.0)]
    public double? lon { get; set; }

    [Required]
    [Range(-85.06, 85.06)]
    public double? lat { get; set; }

    public WebPoint(double? lon, double? lat) { this.lon = lon; this.lat = lat; }

    public WgsPoint AsWgs() => new(lon.Value, lat.Value);
}

/// <summary>
/// Representation of a point in a Cartesian plane.
/// </summary>
public sealed class CartesianPoint
{
    public double x { get; }

    public double y { get; }

    public CartesianPoint(double x, double y) { this.x = x; this.y = y; }
}
