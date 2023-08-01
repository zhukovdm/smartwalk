using SmartWalk.Domain.Entities;
using SmartWalk.Domain.Interfaces;
using SmartWalk.Services.Advicer.Mongo;

namespace SmartWalk.Services.Advicer;

public static class AdvicerFactory
{
    public static Bound GetBound()
        => MongoBoundFactory.GetInstance(MongoDatabaseFactory.GetInstance());

    public static IKeywordAdvicer GetKeywordAdvicer()
        => MongoKeywordAdvicerFactory.GetInstance(MongoDatabaseFactory.GetInstance());
}
