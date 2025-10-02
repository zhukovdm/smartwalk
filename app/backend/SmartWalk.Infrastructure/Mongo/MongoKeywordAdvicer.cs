// using System.Linq;
// using MongoDB.Driver;
using SmartWalk.Core.Interfaces;
using SmartWalk.Infrastructure.Mongo.Helpers;

namespace SmartWalk.Infrastructure.Mongo;

// using Item = TrieKeywordAdvicer.Item;

public sealed class MongoKeywordAdvicer
{
    public static IKeywordAdvicer GetInstance()
    {
        // var docs = MongoCollectionFactory.GetKeywordCollection()
        //     .Find(FilterDefinition<Item>.Empty)
        //     .ToEnumerable(); // synchronous!

        return TrieKeywordAdvicer.GetInstance([] /* docs */);
    }
}
