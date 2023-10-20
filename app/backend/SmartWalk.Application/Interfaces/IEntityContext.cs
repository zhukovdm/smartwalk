using SmartWalk.Core.Interfaces;

namespace SmartWalk.Application.Interfaces;

/// <summary>
/// Calculation context used by `Entity` controllers and handlers.
/// </summary>
public interface IEntityContext
{
    /// <summary>
    /// Abstraction for storing data objects in their original form.
    /// </summary>
    IEntityStore EntityStore { get; init; }
}
