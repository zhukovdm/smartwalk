using System.Threading.Tasks;
using SmartWalk.Application.Entities;
using SmartWalk.Application.Interfaces;
using SmartWalk.Core.Entities;
using SmartWalk.Core.Interfaces;

namespace SmartWalk.Application.Handlers;

/// <summary>
/// Endpoint-specific query handler.
/// </summary>
public sealed class GetEntityPlaceQueryHandler : IGetEntityPlaceQueryHandler
{
    private readonly IEntityStore store;

    public GetEntityPlaceQueryHandler(IEntityStore store) { this.store = store; }

    public Task<ExtendedPlace> Handle(GetEntityPlaceQuery query)
    {
        return store.GetPlace(query.smartId);
    }
}
