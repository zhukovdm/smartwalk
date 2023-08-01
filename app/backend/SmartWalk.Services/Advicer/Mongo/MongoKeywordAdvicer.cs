using MongoDB.Driver;
using SmartWalk.Domain.Interfaces;

namespace SmartWalk.Services.Advicer.Mongo;
using Document = TrieKeywordAdvicer.Item;

internal static class MongoKeywordAdvicerFactory
{
    public static IKeywordAdvicer GetInstance(IMongoDatabase database)
    {
        var docs = database
            .GetCollection<Document>("keyword")
            .Find(FilterDefinition<Document>.Empty)
            .ToEnumerable(); // synchronous!

        return TrieKeywordAdvicer.GetInstance(docs);
    }
}
