using MongoDB.Driver;
using SmartWalk.Domain.Entities;

namespace SmartWalk.Services.Advicer.Mongo;

internal static class MongoBoundFactory
{
    internal static Bound GetInstance(IMongoDatabase database)
    {
        return database
            .GetCollection<Bound>("bound")
            .Find(FilterDefinition<Bound>.Empty)
            .FirstOrDefault(); // synchronous!
    }
}
