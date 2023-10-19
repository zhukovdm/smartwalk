using System.ComponentModel.DataAnnotations;

namespace SmartWalk.Application.Entities;

/// <summary>
/// Raw request.
/// </summary>
public sealed class SearchRoutesRequest
{
    /// <summary>
    /// Serialized query.
    /// </summary>
    /// <example>
    /// {"source":{"lon":14.4035264,"lat":50.0884344},"target":{"lon":14.4039444,"lat":50.0894092},"distance":3000,"categories":[{"keyword":"castle","filters":{}},{"keyword":"restaurant","filters":{}},{"keyword":"tourism","filters":{}}],"arrows":[{"fr":0,"to":2}]}
    /// </example>
    [Required]
    [MinLength(1)]
    public string query { get; init; }
}
