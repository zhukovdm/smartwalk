using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using SmartWalk.Application.Entities;
using SmartWalk.Core.Entities;

/// <summary>
/// Type used for model validation.
/// </summary>
public sealed class ConstrainedSearchRoutesQuery
{
    /// <summary>
    /// Starting point.
    /// </summary>
    [Required]
    public WebPoint source { get; init; }

    /// <summary>
    /// Destination.
    /// </summary>
    [Required]
    public WebPoint target { get; init; }

    /// <summary>
    /// Maximum walking distance in <b>meters</b>.
    /// </summary>
    [Required]
    [Range(0, 30_000)]
    public double? maxDistance { get; init; }

    /// <summary>
    /// Categories relevant for the user.
    /// </summary>
    [Required]
    [MinLength(1)]
    public List<Category> categories { get; init; }

    /// <summary>
    /// User-defined ordering on categories.
    /// </summary>
    [Required]
    public List<WebArrow> arrows { get; init; }
}

/// <summary>
/// Type used for deserialization.
/// </summary>
public sealed class SearchRoutesQuery
{
    public WgsPoint source { get; init; }

    public WgsPoint target { get; init; }

    public double maxDistance { get; init; }

    public List<Category> categories { get; init; }

    public List<Arrow> arrows { get; init; }
}
