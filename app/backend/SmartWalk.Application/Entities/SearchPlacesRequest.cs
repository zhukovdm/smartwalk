using System.ComponentModel.DataAnnotations;

namespace SmartWalk.Application.Entities;

/// <summary>
/// Request object as received by an API controller.
/// </summary>
public sealed class SearchPlacesRequest
{
    /// <example>
    /// {"center":{"lon":14.4035264,"lat":50.0884344},"radius":100,"categories":[]}
    /// </example>
    /// <example>
    /// {"center":{"lon":14.4035264,"lat":50.0884344},"radius":500,"categories":[{"keyword":"museum","filters":{}},{"keyword":"tourism","filters":{}}]}
    /// </example>
    [Required]
    [MinLength(1)]
    public string query { get; init; }
}
