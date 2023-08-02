using MongoDB.Driver;
using SmartWalk.Domain.Entities;

namespace SmartWalk.Infrastructure.Advicer;

internal sealed class MongoBounds
{
    internal static Bounds GetInstance(IMongoDatabase database)
    {
        return database
            .GetCollection<Bounds>("bounds")
            .Find(FilterDefinition<Bounds>.Empty)
            .FirstOrDefault(); // synchronous!
    }
}
