using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;

namespace osm;

internal static class UpdateDefinitionExtensions
{
    internal static UpdateDefinition<Place> SetValue<T>(this UpdateDefinition<Place> update, Expression<Func<Place, T>> target, T value)
    {
        return value is not null ? update.Set(target, value) : update;
    }
}

internal abstract class Target
{
    protected long step = 0;
    private readonly ILogger logger;

    protected void Increment()
    {
        ++step;

        if (step % 1000 == 0)
        {
            logger.LogInformation("Still working... {0} places already processed.", step);
        }
    }

    protected void Total() { logger.LogInformation("Finished, processed a total of {0} places.", step); }

    public Target(ILogger logger) { this.logger = logger; }

    public abstract void Load(Place place);

    public abstract void Complete();
}

internal class MongoTarget : Target
{
    private readonly IMongoDatabase database;
    private readonly List<Place> places = new();

    private void Write()
    {
        var bulk = new List<WriteModel<Place>>();
        var coll = MongoBuilder.GetCollection(database);

        foreach (var place in places)
        {
            var filter = Builders<Place>.Filter.Eq(p => p.linked.osm, place.linked.osm);
            var exists = coll.Find(filter).Limit(1).Any();

            var time = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");

            if (exists) // update
            {
                var update = Builders<Place>.Update
                    .AddToSetEach(p => p.keywords, place.keywords)
                    .SetValue(p => p.name, place.name)
                    .SetValue(p => p.linked.wikidata, place.linked.wikidata)
                    .SetValue(p => p.metadata.updated, time)
                    .SetValue(p => p.attributes.polygon, place.attributes.polygon)
                    .SetValue(p => p.attributes.image, place.attributes.image)
                    .SetValue(p => p.attributes.website, place.attributes.website)
                    .SetValue(p => p.attributes.address, place.attributes.address)
                    .SetValue(p => p.attributes.email, place.attributes.email)
                    .SetValue(p => p.attributes.phone, place.attributes.phone)
                    .SetValue(p => p.attributes.socialNetworks, place.attributes.socialNetworks)
                    .SetValue(p => p.attributes.charge, place.attributes.charge)
                    .SetValue(p => p.attributes.openingHours, place.attributes.openingHours)
                    .SetValue(p => p.attributes.fee, place.attributes.fee)
                    .SetValue(p => p.attributes.delivery, place.attributes.delivery)
                    .SetValue(p => p.attributes.drinkingWater, place.attributes.drinkingWater)
                    .SetValue(p => p.attributes.internetAccess, place.attributes.internetAccess)
                    .SetValue(p => p.attributes.shower, place.attributes.shower)
                    .SetValue(p => p.attributes.smoking, place.attributes.smoking)
                    .SetValue(p => p.attributes.takeaway, place.attributes.takeaway)
                    .SetValue(p => p.attributes.toilets, place.attributes.toilets)
                    .SetValue(p => p.attributes.wheelchair, place.attributes.wheelchair)
                    .SetValue(p => p.attributes.capacity, place.attributes.capacity)
                    .SetValue(p => p.attributes.elevation, place.attributes.elevation)
                    .SetValue(p => p.attributes.minimumAge, place.attributes.minimumAge)
                    .SetValue(p => p.attributes.rating, place.attributes.rating)
                    .SetValue(p => p.attributes.year, place.attributes.year)
                    .SetValue(p => p.attributes.clothes, place.attributes.clothes)
                    .SetValue(p => p.attributes.cuisine, place.attributes.cuisine)
                    .SetValue(p => p.attributes.denomination, place.attributes.denomination)
                    .SetValue(p => p.attributes.payment, place.attributes.payment)
                    .SetValue(p => p.attributes.rental, place.attributes.rental);

                bulk.Add(new UpdateManyModel<Place>(filter, update));
            }

            else // insert
            {
                place.metadata.created = time;
                place.metadata.updated = time;
                bulk.Add(new InsertOneModel<Place>(place));
            }
        }
        _ = coll.BulkWrite(bulk);

        places.Clear();
    }

    public MongoTarget(ILogger logger, IMongoDatabase database) : base(logger)
    {
        this.database = database;
    }

    public override void Load(Place place)
    {
        places.Add(place);
        if (places.Count >= 1000) { Write(); }
        Increment();
    }

    public override void Complete()
    {
        if (places.Count > 0) { Write(); }
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
        catch (Exception) { throw new Exception("Failed to construct a database instance from the given connection string."); }
    }
}
