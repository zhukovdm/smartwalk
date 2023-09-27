using System.Threading.Tasks;
using MongoDB.Driver;
using SmartWalk.Model.Entities;
using SmartWalk.Model.Interfaces;

namespace SmartWalk.Infrastructure.EntityStore;

public sealed class MongoEntityStore : IEntityStore
{
    private readonly IMongoCollection<ExtendedPlace> _collection;

    private MongoEntityStore(IMongoCollection<ExtendedPlace> collection)
    {
        _collection = collection;
    }

    public Task<ExtendedPlace> GetPlace(string smartId)
    {
        return _collection
            .Find(place => place.smartId == smartId)
            .FirstOrDefaultAsync();
    }

    public static IEntityStore GetInstance()
    {
        var coll = MongoCollectionFactory.GetPlaceCollection();
        return new MongoEntityStore(coll);
    }
}
