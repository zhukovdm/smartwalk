using SmartWalk.Domain.Interfaces;

namespace SmartWalk.Services.EntityStore;

public static class EntityStoreFactory
{
    public static IEntityStore GetInstance()
        => MongoEntityStore.GetInstance(MongoDatabaseFactory.GetInstance());
}
