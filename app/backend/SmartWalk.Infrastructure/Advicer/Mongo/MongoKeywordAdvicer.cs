using MongoDB.Driver;
using SmartWalk.Domain.Interfaces;

namespace SmartWalk.Infrastructure.Advicer;

using Document = TrieKeywordsAdvicer.Item;

internal sealed class MongoKeywordsAdvicer
{
    internal static IKeywordsAdvicer GetInstance(IMongoDatabase database)
    {
        var docs = database
            .GetCollection<Document>("keyword")
            .Find(FilterDefinition<Document>.Empty)
            .ToEnumerable(); // synchronous!

        return TrieKeywordsAdvicer.GetInstance(docs);
    }
}
