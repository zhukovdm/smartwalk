using SmartWalk.Domain.Interfaces;

namespace SmartWalk.Api.Contexts;

public interface IEntityContext
{
    IEntityStore Store { get; init; }
}

public sealed class EntityContext : IEntityContext
{
    public IEntityStore Store { get; init; }
}
