using SmartWalk.Domain.Interfaces;

namespace SmartWalk.Services.EntityIndex;

public static class EntityIndexFactory
{
    public static IEntityIndex GetInstance()
        => MongoEntityIndex.GetInstance(MongoDatabaseFactory.GetInstance());
}
