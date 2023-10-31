using MongoDB.Driver;

namespace osm;

internal static class MongoBuilder
{
    private static readonly string _databaseName = "smartwalk";

    private static readonly string _collectionName = "place";

    internal static IMongoDatabase GetDatabase(string conn)
    {
        return new MongoClient(new MongoUrl(conn)).GetDatabase(_databaseName);
    }

    internal static IMongoCollection<Place> GetCollection(IMongoDatabase database)
    {
        return database.GetCollection<Place>(_collectionName);
    }
}
