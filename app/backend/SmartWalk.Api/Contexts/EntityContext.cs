using SmartWalk.Model.Interfaces;

namespace SmartWalk.Api.Contexts;

public interface IEntityContext
{
    IEntityStore EntityStore { get; init; }
}

public sealed class EntityContext : IEntityContext
{
    public IEntityStore EntityStore { get; init; }
}
