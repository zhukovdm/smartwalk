using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SmartWalk.Domain.Entities;

public sealed class PlacesRequest
{
    /// <summary>
    /// Coordinates of a pivot point.
    /// </summary>
    [Required]
    public WebPoint center { get; set; }

    /// <summary>
    /// Radius around the center (in meters).
    /// </summary>
    [Required]
    [Range(0, 12_000)]
    public double? radius { get; set; }

    /// <summary>
    /// Categories with a keyword and optional attributes.
    /// </summary>
    [Required]
    [MinLength(1)]
    public List<Category> categories { get; set; }
}

public sealed class PlacesResponse
{
    /// <summary>
    /// Places satisfying given categories.
    /// </summary>
    [Required]
    public List<Place> places { get; set; }
}
