using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SmartWalk.Domain.Entities;

public sealed class GeoJsonPoint
{
    [Required]
    public string type { get; set; } = "Point";

    [Required]
    [MinLength(2)]
    public List<double> coordinates { get; set; }
}
