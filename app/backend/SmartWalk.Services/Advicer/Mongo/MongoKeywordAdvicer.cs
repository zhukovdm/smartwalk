using MongoDB.Driver;
using SmartWalk.Domain.Interfaces;

namespace SmartWalk.Services.Advicer;

using Document = TrieKeywordAdvicer.Item;

internal sealed class MongoKeywordAdvicer
{
    internal static IKeywordAdvicer GetInstance(IMongoDatabase database)
    {
        var docs = database
            .GetCollection<Document>("keyword")
            .Find(FilterDefinition<Document>.Empty)
            .ToEnumerable(); // synchronous!

        return TrieKeywordAdvicer.GetInstance(docs);
    }
}
