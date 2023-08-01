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
    private static readonly string CONN_STR
        = Environment.GetEnvironmentVariable("SMARTWALK_MONGO_CONN_STR") ?? "mongodb://localhost:27017";

    public static IMongoDatabase GetInstance()
    {
        return new MongoClient(new MongoUrl(CONN_STR)).GetDatabase("smartwalk");
    }
}
