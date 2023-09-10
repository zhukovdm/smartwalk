using System;
using System.Collections.Generic;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;

namespace osm;

internal abstract class Target
{
    protected long step = 0;
    private readonly ILogger _logger;

    protected void Increment()
    {
        ++step;

        if (step % 1000 == 0)
        {
            _logger.LogInformation("Still working... {0} places already created.", step);
        }
    }

    protected void Total() { _logger.LogInformation("Finished, created a total of {0} places.", step); }

    public Target(ILogger logger) { _logger = logger; }

    public abstract void Consume(Place place);

    public abstract void Complete();
}

internal class MongoTarget : Target
{
    private readonly IMongoDatabase _database;
    private readonly List<Place> _places = new();

    private void Write()
    {
        var bulk = new List<WriteModel<Place>>();
        var coll = MongoBuilder.GetCollection(_database);

        // upsert strategy!

        foreach (var g in _places)
        {
            var upsert = new ReplaceOneModel<Place>(
                Builders<Place>.Filter.Where(d => d.linked.osm == g.linked.osm), g
            )
            { IsUpsert = true };

            bulk.Add(upsert);
        }
        _ = coll.BulkWrite(bulk);

        _places.Clear();
    }

    public MongoTarget(ILogger logger, IMongoDatabase database) : base(logger)
    {
        _database = database;
    }

    public override void Consume(Place place)
    {
        _places.Add(place);
        if (_places.Count >= 1000) { Write(); }
        Increment();
    }

    public override void Complete()
    {
        if (_places.Count > 0) { Write(); }
        Total();
    }
}

internal static class TargetFactory
{
    public static Target GetInstance(ILogger logger, string conn)
    {
        try
        {
            return new MongoTarget(logger, MongoBuilder.GetDatabase(conn));
        }
        catch (Exception) { throw new Exception("Failed to get database instance from the given connection string."); }
    }
}
