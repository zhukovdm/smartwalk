using SmartWalk.Core.Interfaces;

namespace SmartWalk.Application.Interfaces;

/// <summary>
/// Calculation context used by `Search` controllers and handlers.
/// </summary>
public interface ISearchContext
{
    IEntityIndex EntityIndex { get; init; }

    IRoutingEngine RoutingEngine { get; init; }
}
