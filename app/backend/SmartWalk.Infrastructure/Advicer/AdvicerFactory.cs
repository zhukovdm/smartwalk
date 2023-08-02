using SmartWalk.Domain.Entities;
using SmartWalk.Domain.Interfaces;

namespace SmartWalk.Infrastructure.Advicer;

public static class AdvicerFactory
{
    public static Bounds GetBounds()
        => MongoBounds.GetInstance(MongoDatabaseFactory.GetInstance());

    public static IKeywordAdvicer GetKeywordAdvicer()
        => MongoKeywordAdvicer.GetInstance(MongoDatabaseFactory.GetInstance());
}
