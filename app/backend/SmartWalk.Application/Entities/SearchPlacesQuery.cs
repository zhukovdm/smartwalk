using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using SmartWalk.Core.Entities;

namespace SmartWalk.Application.Entities;

/// <summary>
/// Type used for model (V)alidation.
/// </summary>
public sealed class ConstrainedSearchPlacesQuery
{
    /// <summary>
    /// Center point.
    /// </summary>
    [Required]
    public WebPoint center { get; init; }

    /// <summary>
    /// Radius around the center (in meters).
    /// </summary>
    [Required]
    [Range(0, 5_000)]
    public double? radius { get; init; }

    /// <summary>
    /// Categories relevant for the user.
    /// </summary>
    [Required]
    public List<Category> categories { get; init; }
}

/// <summary>
/// Type used for (D)eserialization and handling.
/// </summary>
public sealed class SearchPlacesQuery
{
    public WgsPoint center { get; init; }

    public double radius { get; init; }

    public List<Category> categories { get; init; }
}
