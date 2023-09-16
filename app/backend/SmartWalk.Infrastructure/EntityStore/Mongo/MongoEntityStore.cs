using System.Threading.Tasks;
using MongoDB.Driver;
using SmartWalk.Domain.Entities;
using SmartWalk.Domain.Interfaces;

namespace SmartWalk.Infrastructure.EntityStore;

internal sealed class MongoEntityStore : IEntityStore
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

    public static IEntityStore GetInstance(IMongoCollection<ExtendedPlace> collection)
        => new MongoEntityStore(collection);
}
