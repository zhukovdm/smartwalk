using System;
using MongoDB.Driver;
using SmartWalk.Core.Entities;

namespace SmartWalk.Infrastructure.Mongo.Helpers;

using Item = TrieKeywordAdvicer.Item;

internal static class MongoCollectionFactory
{
    private static readonly IMongoDatabase db;

    static MongoCollectionFactory()
    {
        var url = new MongoUrl(Environment.GetEnvironmentVariable("SMARTWALK_MONGO_CONN_STR"));
        db = new MongoClient(url).GetDatabase("smartwalk");
    }

    public static IMongoCollection<Item> GetKeywordCollection()
    {
        return db.GetCollection<Item>("keyword");
    }

    public static IMongoCollection<ExtendedPlace> GetPlaceCollection()
    {
        return db.GetCollection<ExtendedPlace>("place");
    }
}
