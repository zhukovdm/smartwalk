using SmartWalk.Domain.Interfaces;

namespace SmartWalk.Api.Contexts;

public interface ISearchContext
{
    IEntityIndex Index { get; init; }

    IRoutingEngine Engine { get; init; }
}

public sealed class SearchContext : ISearchContext
{
    public IEntityIndex Index { get; init; }

    public IRoutingEngine Engine { get; init; }
}
