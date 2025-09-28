using System.ComponentModel.DataAnnotations;

namespace SmartWalk.Core.Entities;

public sealed class Arrow
{
    /// <summary>
    /// Source category.
    /// </summary>
    [Required]
    public int fr { get; }

    /// <summary>
    /// Target category.
    /// </summary>
    [Required]
    public int to { get; }

    public Arrow(int fr, int to)
    {
        this.fr = fr;
        this.to = to;
    }
}
