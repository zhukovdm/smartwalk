using System.ComponentModel.DataAnnotations;

using CollectBound = System.Collections.Generic.List<string>;

namespace SmartWalk.Domain.Entities;

public sealed class NumericBound
{
    [Required]
    public double min { get; set; }

    [Required]
    public double max { get; set; }
}

public sealed class Bound
{
    [Required]
    public NumericBound capacity { get; set; }

    [Required]
    public NumericBound elevation { get; set; }

    [Required]
    public NumericBound minimumAge { get; set; }

    [Required]
    public NumericBound rating { get; set; }

    [Required]
    public NumericBound year { get; set; }

    [Required]
    public CollectBound clothes { get; set; }

    [Required]
    public CollectBound cuisine { get; set; }

    [Required]
    public CollectBound denomination { get; set; }

    [Required]
    public CollectBound payment { get; set; }

    [Required]
    public CollectBound rental { get; set; }
}
