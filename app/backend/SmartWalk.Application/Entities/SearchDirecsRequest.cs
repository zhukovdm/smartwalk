using System.ComponentModel.DataAnnotations;

namespace SmartWalk.Application.Entities;

/// <summary>
/// Request object as received by an API controller.
/// </summary>
public sealed class SearchDirecsRequest
{
    /// <example>
    /// {"waypoints":[{"lon":14.4035264,"lat":50.0884344},{"lon":14.4057219,"lat":50.0919964}]}
    /// </example>
    [Required]
    [MinLength(1)]
    public string query { get; init; }
}
