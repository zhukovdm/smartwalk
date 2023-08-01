using SmartWalk.Domain.Interfaces;

namespace SmartWalk.Infrastructure.EntityStore;

public static class EntityStoreFactory
{
    public static IEntityStore GetInstance()
        => MongoEntityStore.GetInstance(MongoDatabaseFactory.GetInstance());
}
