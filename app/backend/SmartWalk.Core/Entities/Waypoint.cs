using System.ComponentModel.DataAnnotations;

namespace SmartWalk.Core.Entities;

public sealed class Waypoint
{
    /// <example>64c91f8359914b93b23b01d9</example>
    [Required]
    public string smartId { get; }

    /// <example>0</example>
    [Required]
    public int category { get; }

    public Waypoint(string smartId, int category)
    {
        this.smartId = smartId;
        this.category = category;
    }
}
