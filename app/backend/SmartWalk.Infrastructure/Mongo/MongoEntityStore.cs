using System.Threading.Tasks;
using MongoDB.Driver;
using SmartWalk.Core.Entities;
using SmartWalk.Core.Interfaces;
using SmartWalk.Infrastructure.Mongo.Helpers;

namespace SmartWalk.Infrastructure.Mongo;

public sealed class MongoEntityStore : IEntityStore
{
    private readonly IMongoCollection<ExtendedPlace> collection;

    private MongoEntityStore(IMongoCollection<ExtendedPlace> collection)
    {
        this.collection = collection;
    }

    public Task<ExtendedPlace> GetPlace(string smartId)
    {
        return collection
            .Find(place => place.smartId == smartId)
            .FirstOrDefaultAsync();
    }

    public static IEntityStore GetInstance()
    {
        var coll = MongoCollectionFactory.GetPlaceCollection();
        return new MongoEntityStore(coll);
    }
}
