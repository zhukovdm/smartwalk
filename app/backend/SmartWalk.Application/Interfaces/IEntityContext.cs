using SmartWalk.Core.Interfaces;

namespace SmartWalk.Application.Interfaces;

/// <summary>
/// Calculation context used by `Entity` controllers and handlers.
/// </summary>
public interface IEntityContext
{
    IEntityStore EntityStore { get; init; }
}
