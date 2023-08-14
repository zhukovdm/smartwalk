using SmartWalk.Domain.Entities;
using SmartWalk.Domain.Interfaces;

namespace SmartWalk.Infrastructure.Advicer;

public static class AdvicerFactory
{
    public static BoundsAdvice GetBounds()
        => MongoBounds.GetInstance(MongoDatabaseFactory.GetInstance());

    public static IKeywordsAdvicer GetKeywordsAdvicer()
        => MongoKeywordsAdvicer.GetInstance(MongoDatabaseFactory.GetInstance());
}
