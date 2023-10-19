using System.Threading.Tasks;
using SmartWalk.Application.Entities;
using SmartWalk.Application.Interfaces;
using SmartWalk.Core.Entities;
using SmartWalk.Core.Interfaces;

namespace SmartWalk.Application.Handlers;

/// <summary>
/// Endpoint-specific handler.
/// </summary>
public sealed class GetPlaceHandler : IQueryHandler<GetPlaceQuery, ExtendedPlace>
{
    private readonly IEntityStore _store;

    public GetPlaceHandler(IEntityStore store) { _store = store; }

    public Task<ExtendedPlace> Handle(GetPlaceQuery query)
    {
        return _store.GetPlace(query.smartId);
    }
}
