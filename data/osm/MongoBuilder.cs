using MongoDB.Driver;

namespace osm;

internal static class MongoBuilder
{
    private static readonly string databaseName = "smartwalk";

    private static readonly string collectionName = "place";

    internal static IMongoDatabase GetDatabase(string conn)
    {
        return new MongoClient(new MongoUrl(conn)).GetDatabase(databaseName);
    }

    internal static IMongoCollection<Place> GetCollection(IMongoDatabase database)
    {
        return database.GetCollection<Place>(collectionName);
    }
}
