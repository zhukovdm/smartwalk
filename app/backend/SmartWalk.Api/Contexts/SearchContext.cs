using SmartWalk.Domain.Interfaces;

namespace SmartWalk.Api.Contexts;

public interface ISearchContext
{
    IEntityIndex EntityIndex { get; init; }

    IGeoIndex GeoIndex { get; init; }

    IRoutingEngine RoutingEngine { get; init; }
}

public sealed class SearchContext : ISearchContext
{
    public IEntityIndex EntityIndex { get; init; }

    public IGeoIndex GeoIndex { get; init; }

    public IRoutingEngine RoutingEngine { get; init; }
}
