using SmartWalk.Model.Interfaces;

namespace SmartWalk.Infrastructure.EntityIndex;

public static class EntityIndexFactory
{
    public static IEntityIndex GetInstance()
        => MongoEntityIndex.GetInstance(MongoCollectionFactory.GetPlaceCollection());
}
