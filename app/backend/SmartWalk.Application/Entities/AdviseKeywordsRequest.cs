using System.ComponentModel.DataAnnotations;

namespace SmartWalk.Application.Entities;

/// <summary>
/// Type used for model (V)alidation.
/// </summary>
public sealed class AdviseKeywordsRequest
{
    /// <example>m</example>
    [Required]
    [MinLength(1)]
    public string prefix { get; init; }

    /// <example>5</example>
    [Required]
    [Range(1, int.MaxValue)]
    public int? count { get; init; }
}
