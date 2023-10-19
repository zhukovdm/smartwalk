using MongoDB.Driver;
using SmartWalk.Core.Interfaces;

namespace SmartWalk.Infrastructure.Advicer;

using Item = TrieKeywordAdvicer.Item;

public sealed class MongoKeywordAdvicer
{
    public static IKeywordAdvicer GetInstance()
    {
        var coll = MongoCollectionFactory.GetKeywordCollection();

        var docs = coll
            .Find(FilterDefinition<Item>.Empty)
            .ToEnumerable(); // synchronous!

        return TrieKeywordAdvicer.GetInstance(docs);
    }
}
