using MongoDB.Driver;
using SmartWalk.Domain.Interfaces;

namespace SmartWalk.Infrastructure.Advicer;

using Item = TrieKeywordsAdvicer.Item;

internal sealed class MongoKeywordsAdvicer
{
    internal static IKeywordsAdvicer GetInstance(IMongoCollection<Item> collection)
    {
        var docs = collection
            .Find(FilterDefinition<Item>.Empty)
            .ToEnumerable(); // synchronous!

        return TrieKeywordsAdvicer.GetInstance(docs);
    }
}
