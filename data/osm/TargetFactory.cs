using Microsoft.Extensions.Logging;
using MongoDB.Driver;
using System;

namespace osm;

internal static class TargetFactory
{
    public static Target GetInstance(ILogger logger, string conn)
    {
        try
        {
            var client = new MongoClient(new MongoUrl(conn));
            return new MongoTarget(logger, client.GetDatabase(Constants.MONGO_DATABASE));
        }
        catch (Exception) { throw new Exception("Failed to get database instance from the given connection string."); }
    }
}
