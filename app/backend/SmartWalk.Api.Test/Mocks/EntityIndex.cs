using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MongoDB.Bson;
using SmartWalk.Model.Entities;
using SmartWalk.Model.Interfaces;

namespace SmartWalk.Api.Test.Mocks;

internal sealed class FakeWorkingEntityIndex : IEntityIndex
{
    private static readonly Dictionary<string, Place> _places = new();

    private static double GenerateRandomInInterval(double min, double max)
    {
        return new Random().NextDouble() * (max - min) + min;
    }

    static FakeWorkingEntityIndex()
    {
        var rnd = new Random();

        for (int i = 0; i < 100; ++i)
        {
            var lon = GenerateRandomInInterval(-180.0, +180.0);
            var lat = GenerateRandomInInterval(-85.06, +85.06);

            _places.Add(ObjectId.GenerateNewId().ToString(), new()
            {
                location = new(lon, lat)
            });
        }
    }

    public Task<List<Place>> GetAround(WgsPoint center, double radius, IReadOnlyList<Category> categories)
    {
        throw new System.NotImplementedException();
    }

    public Task<List<Place>> GetWithin(IReadOnlyList<WgsPoint> polygon, IReadOnlyList<Category> categories)
    {
        throw new System.NotImplementedException();
    }
}

internal sealed class FakeFailingEntityIndex : IEntityIndex
{
    public Task<List<Place>> GetAround(WgsPoint center, double radius, IReadOnlyList<Category> categories)
    {
        throw new System.NotImplementedException();
    }

    public Task<List<Place>> GetWithin(IReadOnlyList<WgsPoint> polygon, IReadOnlyList<Category> categories)
    {
        throw new System.NotImplementedException();
    }
}
