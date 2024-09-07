using System.Threading.Tasks;
using SmartWalk.Application.Entities;
using SmartWalk.Application.Interfaces;
using SmartWalk.Core.Entities;
using SmartWalk.Core.Interfaces;

namespace SmartWalk.Application.Handlers;

/// <summary>
/// Endpoint-specific query handler.
/// </summary>
public sealed class GetPlaceQueryHandler : IQueryHandler<GetPlaceQuery, ExtendedPlace>
{
    private readonly IEntityStore store;

    public GetPlaceQueryHandler(IEntityStore store) { this.store = store; }

    public Task<ExtendedPlace> Handle(GetPlaceQuery query)
    {
        return store.GetPlace(query.smartId);
    }
}
