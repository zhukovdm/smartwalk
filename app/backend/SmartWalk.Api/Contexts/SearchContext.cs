using SmartWalk.Model.Interfaces;

namespace SmartWalk.Api.Contexts;

public interface ISearchContext
{
    IEntityIndex EntityIndex { get; init; }

    IRoutingEngine RoutingEngine { get; init; }
}

public sealed class SearchContext : ISearchContext
{
    public IEntityIndex EntityIndex { get; init; }

    public IRoutingEngine RoutingEngine { get; init; }
}
