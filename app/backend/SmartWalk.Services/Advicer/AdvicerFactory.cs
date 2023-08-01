using SmartWalk.Domain.Entities;
using SmartWalk.Domain.Interfaces;

namespace SmartWalk.Services.Advicer;

public static class AdvicerFactory
{
    public static Bound GetBound()
        => MongoBound.GetInstance(MongoDatabaseFactory.GetInstance());

    public static IKeywordAdvicer GetKeywordAdvicer()
        => MongoKeywordAdvicer.GetInstance(MongoDatabaseFactory.GetInstance());
}
