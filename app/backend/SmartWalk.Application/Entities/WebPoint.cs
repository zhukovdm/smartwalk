using System.ComponentModel.DataAnnotations;
using SmartWalk.Core.Algorithms;
using SmartWalk.Core.Entities;

namespace SmartWalk.Application.Entities;

/// <summary>
/// Representation of a point in EPSG:4326 restricted to the range of EPSG:3857.
/// See https://epsg.io/4326 and https://epsg.io/3857 for details.
/// </summary>
public sealed class WebPoint
{
    /// <example>0.0</example>
    [Required]
    [Range(-180.0, +180.0)]
    public double? lon { get; init; }

    /// <example>0.0</example>
    [Required]
    [Range(-85.06, +85.06)]
    public double? lat { get; init; }

    public WgsPoint AsWgs() => new(Spherical.Round(lon.Value), Spherical.Round(lat.Value));
}
