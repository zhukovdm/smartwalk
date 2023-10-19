using SmartWalk.Application.Interfaces;
using SmartWalk.Core.Interfaces;

namespace SmartWalk.Application.Entities;

public sealed class SearchContext : ISearchContext
{
    public IEntityIndex EntityIndex { get; init; }

    public IRoutingEngine RoutingEngine { get; init; }
}
