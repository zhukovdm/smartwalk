using SmartWalk.Core.Interfaces;

namespace SmartWalk.Application.Interfaces;

/// <summary>
/// Calculation context used by `Search` controllers and handlers.
/// </summary>
public interface ISearchContext
{
    /// <summary>
    /// Abstraction for searching data objects.
    /// </summary>
    IEntityIndex EntityIndex { get; init; }

    /// <summary>
    /// Abstraction for finding network traversals and distance matrices.
    /// </summary>
    IRoutingEngine RoutingEngine { get; init; }
}
