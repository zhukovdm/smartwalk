using System;
using MongoDB.Driver;
using SmartWalk.Infrastructure.Advicer;
using SmartWalk.Model.Entities;

namespace SmartWalk.Infrastructure;

using Item = TrieKeywordAdvicer.Item;

internal static class MongoCollectionFactory
{
    private static readonly IMongoDatabase _db;

    static MongoCollectionFactory()
    {
        var url = new MongoUrl(Environment.GetEnvironmentVariable("SMARTWALK_MONGO_CONN_STR"));
        _db = new MongoClient(url).GetDatabase("smartwalk");
    }

    public static IMongoCollection<Item> GetKeywordCollection()
        => _db.GetCollection<Item>("keyword");

    public static IMongoCollection<ExtendedPlace> GetPlaceCollection()
        => _db.GetCollection<ExtendedPlace>("place");
}
