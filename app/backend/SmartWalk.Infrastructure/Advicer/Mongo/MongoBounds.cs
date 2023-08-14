using MongoDB.Driver;
using SmartWalk.Domain.Entities;

namespace SmartWalk.Infrastructure.Advicer;

internal sealed class MongoBounds
{
    internal static BoundsAdvice GetInstance(IMongoDatabase database)
    {
        return database
            .GetCollection<BoundsAdvice>("bounds")
            .Find(FilterDefinition<BoundsAdvice>.Empty)
            .FirstOrDefault(); // synchronous!
    }
}
