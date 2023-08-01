using MongoDB.Driver;
using SmartWalk.Domain.Entities;

namespace SmartWalk.Infrastructure.Advicer;

internal sealed class MongoBound
{
    internal static Bound GetInstance(IMongoDatabase database)
    {
        return database
            .GetCollection<Bound>("bound")
            .Find(FilterDefinition<Bound>.Empty)
            .FirstOrDefault(); // synchronous!
    }
}
