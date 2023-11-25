using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using SmartWalk.Core.Entities;
using SmartWalk.Core.Interfaces;

namespace SmartWalk.Api.Test;

internal sealed class FakeWorkingEntityIndex : IEntityIndex
{
    private static readonly List<Place> places;

    private static double GenerateRandomInInterval(double min, double max)
    {
        return new Random().NextDouble() * (max - min) + min;
    }

    static FakeWorkingEntityIndex()
    {
        var buffer = new Dictionary<string, Place>();

        for (int i = 0; i < 100; ++i)
        {
            var lon = GenerateRandomInInterval(-180.0, +180.0);
            var lat = GenerateRandomInInterval(-85.06, +85.06);
            var smartId = ObjectId.GenerateNewId().ToString();

            buffer.Add(smartId, new()
            {
                smartId = smartId,
                name = $"Place {i}",
                location = new(lon, lat),
                keywords = new()
                {
                    "a",
                    "b",
                    "c"
                },
                categories = new() { 0, 1, 2 }
            });
        }
        places = buffer.Values.ToList();
    }

    public Task<List<Place>> GetAround(WgsPoint center, double radius, IReadOnlyList<Category> categories)
    {
        return Task.FromResult(places);
    }

    public Task<List<Place>> GetWithin(IReadOnlyList<WgsPoint> polygon, IReadOnlyList<Category> categories)
    {
        return Task.FromResult(places);
    }
}

internal sealed class FakeFailingEntityIndex : IEntityIndex
{
    public Task<List<Place>> GetAround(WgsPoint center, double radius, IReadOnlyList<Category> categories)
    {
        throw new Exception($"{this.GetType()}: GetAround");
    }

    public Task<List<Place>> GetWithin(IReadOnlyList<WgsPoint> polygon, IReadOnlyList<Category> categories)
    {
        throw new Exception($"{this.GetType()}: GetWithin");
    }
}
