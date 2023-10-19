using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using SmartWalk.Core.Entities;

namespace SmartWalk.Application.Entities;

/// <summary>
/// Type used for (V)alidation.
/// </summary>
public sealed class ConstrainedSearchDirecsQuery
{
    [Required]
    [MinLength(2)]
    public List<WebPoint> waypoints { get; init; }
}

/// <summary>
/// Type used for (D)eserialization and handling.
/// </summary>
public sealed class SearchDirecsQuery
{
    public List<WgsPoint> waypoints { get; init; }
}
