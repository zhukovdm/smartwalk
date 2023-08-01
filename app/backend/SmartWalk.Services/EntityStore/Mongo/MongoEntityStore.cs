using System.Threading.Tasks;
using MongoDB.Driver;
using SmartWalk.Domain.Entities;
using SmartWalk.Domain.Interfaces;

namespace SmartWalk.Services.EntityStore;

internal sealed class MongoEntityStore : MongoService, IEntityStore
{
    private MongoEntityStore(IMongoDatabase database) : base(database) { }

    public async Task<ExtendedPlace> GetPlace(string smartId)
    {
        return await _database
            .GetCollection<ExtendedPlace>("place")
            .Find(place => place.smartId == smartId)
            .FirstOrDefaultAsync();
    }

    public static IEntityStore GetInstance(IMongoDatabase database) => new MongoEntityStore(database);
}
