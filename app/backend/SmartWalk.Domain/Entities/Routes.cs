using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SmartWalk.Domain.Entities;

public sealed class Route
{
    /// <summary>
    /// Connect source, target, and waypoints in-between.
    /// </summary>
    [Required]
    public ShortestPath path { get; set; }

    /// <summary>
    /// Ordered sequence of places.
    /// </summary>
    [Required]
    public List<Place> waypoints { get; set; }
}

public sealed class PrecedenceWebEdge
{
    /// <summary>
    /// Category from.
    /// </summary>
    [Required]
    [Range(0, int.MaxValue)]
    public int? fr { get; set; }

    /// <summary>
    /// Category to.
    /// </summary>
    [Required]
    [Range(0, int.MaxValue)]
    public int? to { get; set; }
}

public sealed class PrecedenceEdge
{
    /// <summary>
    /// Category from.
    /// </summary>
    public int fr { get; set; }

    /// <summary>
    /// Category to.
    /// </summary>
    public int to { get; set; }
}

public sealed class RoutesRequest
{
    /// <summary>
    /// Starting point.
    /// </summary>
    [Required]
    public WebPoint source { get; set; }

    /// <summary>
    /// Destination point.
    /// </summary>
    [Required]
    public WebPoint target { get; set; }

    /// <summary>
    /// Maximum walking distance in <b>meters</b>.
    /// </summary>
    [Required]
    [Range(0, 30_000)]
    public double? distance { get; set; }

    /// <summary>
    /// Categories of objects that the user is interested in.
    /// </summary>
    [Required]
    [MinLength(1)]
    public List<Category> categories { get; set; }

    /// <summary>
    /// Order on categories imposed by the user.
    /// </summary>
    [Required]
    public List<PrecedenceWebEdge> precedence { get; set; }
}

public sealed class RoutesResponse
{
    /// <summary>
    /// List of advised route objects.
    /// </summary>
    [Required]
    public List<Route> routes { get; set; }
}
