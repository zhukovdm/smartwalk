using Microsoft.Extensions.Logging;
using MongoDB.Driver;
using System;

namespace osm;

internal static class TargetFactory
{
    private static readonly string _conn = "GRAINPATH_DBM_CONN";

    public static Target GetInstance(ILogger logger)
    {
        string conn;

        try
        {
            conn = System.Environment.GetEnvironmentVariable(_conn);
        }
        catch (Exception) { throw new Exception("Failed to obtain connection string from the environment."); }

        IMongoDatabase database;

        try
        {
            var client = new MongoClient(new MongoUrl(conn));
            database = client.GetDatabase(Constants.MONGO_DATABASE);
        }
        catch (Exception) { throw new Exception("Failed to get database instance from the given connection string."); }

        return new MongoTarget(logger, database);
    }
}
