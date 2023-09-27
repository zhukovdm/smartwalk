using SmartWalk.Model.Interfaces;

namespace SmartWalk.Infrastructure.Advicer;

public static class AdvicerFactory
{
    public static IKeywordsAdvicer GetKeywordsAdvicer()
        => MongoKeywordsAdvicer.GetInstance(MongoCollectionFactory.GetKeywordCollection());
}
