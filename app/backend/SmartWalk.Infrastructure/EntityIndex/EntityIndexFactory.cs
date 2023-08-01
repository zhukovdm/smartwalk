using SmartWalk.Domain.Interfaces;

namespace SmartWalk.Infrastructure.EntityIndex;

public static class EntityIndexFactory
{
    public static IEntityIndex GetInstance()
        => MongoEntityIndex.GetInstance(MongoDatabaseFactory.GetInstance());
}
