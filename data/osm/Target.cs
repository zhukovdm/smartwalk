using Microsoft.Extensions.Logging;
using MongoDB.Driver;
using System.Collections.Generic;

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
            _logger.LogInformation("Still working... {0} objects already consumed.", step);
        }
    }

    protected void Total() { _logger.LogInformation("Finished, consumed {0} objects total.", step); }

    public Target(ILogger logger) { _logger = logger; }

    public abstract void Consume(Place grain);

    public abstract void Complete();
}

internal class MockTarget : Target
{
    public MockTarget(ILogger logger, IMongoDatabase database) : base(logger) { }

    public override void Consume(Place grain) { Increment(); }

    public override void Complete() { Total(); }
}

internal class MongoTarget : Target
{
    private readonly IMongoDatabase _database;
    private readonly List<Place> _grains = new();

    private void Write()
    {
        var bulk = new List<WriteModel<Place>>();
        var coll = _database.GetCollection<Place>(Constants.MONGO_GRAIN_COLLECTION);

        // upsert strategy!

        foreach (var g in _grains)
        {
            var upsert = new ReplaceOneModel<Place>(
                Builders<Place>.Filter.Where(d => d.linked.osm == g.linked.osm), g
            )
            { IsUpsert = true };

            bulk.Add(upsert);
        }
        _ = coll.BulkWrite(bulk);

        _grains.Clear();
    }

    public MongoTarget(ILogger logger, IMongoDatabase database) : base(logger)
    {
        _database = database;
    }

    public override void Consume(Place grain)
    {
        _grains.Add(grain);
        if (_grains.Count >= 1000) { Write(); }
        Increment();
    }

    public override void Complete()
    {
        if (_grains.Count > 0) { Write(); }
        Total();
    }
}
