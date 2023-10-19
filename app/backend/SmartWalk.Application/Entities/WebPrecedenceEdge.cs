using System.ComponentModel.DataAnnotations;

namespace SmartWalk.Application.Entities;

public sealed class WebPrecedenceEdge
{
    /// <example>0</example>
    [Required]
    [Range(0, int.MaxValue)]
    public int? fr { get; init; }

    /// <example>1</example>
    [Required]
    [Range(0, int.MaxValue)]
    public int? to { get; init; }
}
