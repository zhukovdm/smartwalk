using System;
using MongoDB.Driver;

namespace SmartWalk.Services;

internal abstract class MongoService
{
    protected IMongoDatabase _database { get; init; }

    protected MongoService(IMongoDatabase database) { _database = database; }
}

internal static class MongoDatabaseFactory
{
    public static readonly string PLACE_COLL = "place";

    public static IMongoDatabase GetInstance()
    {
        var conn = Environment.GetEnvironmentVariable("SMARTWALK_MONGO_CONN_STR") ?? "mongodb://localhost:27017";
        return new MongoClient(new MongoUrl(conn)).GetDatabase("smartwalk");
    }
}
