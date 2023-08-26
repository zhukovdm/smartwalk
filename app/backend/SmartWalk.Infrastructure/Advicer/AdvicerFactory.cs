using SmartWalk.Domain.Interfaces;

namespace SmartWalk.Infrastructure.Advicer;

public static class AdvicerFactory
{
    public static IKeywordsAdvicer GetKeywordsAdvicer()
        => MongoKeywordsAdvicer.GetInstance(MongoDatabaseFactory.GetInstance());
}
