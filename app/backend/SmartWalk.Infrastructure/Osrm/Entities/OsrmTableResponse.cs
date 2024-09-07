using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SmartWalk.Infrastructure.Osrm.Entities;

internal sealed class OsrmTableResponse
{
    [Required]
    public string code { get; init; }

    [Required]
    public List<List<double>> distances { get; init; }
}
