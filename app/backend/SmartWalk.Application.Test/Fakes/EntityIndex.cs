using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using SmartWalk.Core.Entities;
using SmartWalk.Core.Interfaces;

namespace SmartWalk.Application.Test;

internal class FakeEntityIndex : IEntityIndex
{
    private readonly List<Place> _places = [];

    public FakeEntityIndex(int order, IReadOnlyList<string> categories)
    {
        var rnd = new Random();

        for (int i = 0; i < order; ++i)
        {
            _places.Add(new()
            {
                smartId = ObjectId.GenerateNewId().ToString(),
                name = $"Place {i}",
                location = new(rnd.NextDouble(), rnd.NextDouble()),
                keywords = [.. categories],
                categories = [.. Enumerable.Range(0, categories.Count)]
            });
        }
    }

    public Task<List<Place>> GetAround(WgsPoint center, double radius, IReadOnlyList<Category> categories)
    {
        throw new NotImplementedException();
    }

    public Task<List<Place>> GetWithin(IReadOnlyList<WgsPoint> polygon, IReadOnlyList<Category> categories)
    {
        return Task.FromResult(_places);
    }
}
