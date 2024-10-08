using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using SmartWalk.Core.Entities;
using SmartWalk.Core.Interfaces;

namespace SmartWalk.Api.Test.Fakes;

internal sealed class FakeWorkingEntityStore : IEntityStore
{
    public static readonly string EXISTING_SMART_ID = "650082cceb01431ab752c59d";

    private readonly Dictionary<string, ExtendedPlace> _store = new()
    {
        { EXISTING_SMART_ID, new() }
    };

    public Task<ExtendedPlace> GetPlace(string smartId)
    {
        var result = _store.TryGetValue(smartId, out var place) ? place : null;
        return Task.FromResult<ExtendedPlace>(result);
    }
}

internal sealed class FakeFailingEntityStore : IEntityStore
{
    public Task<ExtendedPlace> GetPlace(string smartId)
    {
        throw new Exception($"{GetType()}: GetPlace");
    }
}
