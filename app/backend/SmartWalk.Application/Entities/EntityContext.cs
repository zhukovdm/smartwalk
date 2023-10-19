using SmartWalk.Application.Interfaces;
using SmartWalk.Core.Interfaces;

namespace SmartWalk.Application.Entities;

public sealed class EntityContext : IEntityContext
{
    public IEntityStore EntityStore { get; init; }
}
