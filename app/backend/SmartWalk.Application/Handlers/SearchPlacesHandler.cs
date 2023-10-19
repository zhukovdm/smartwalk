using System.Collections.Generic;
using System.Threading.Tasks;
using SmartWalk.Application.Entities;
using SmartWalk.Application.Interfaces;
using SmartWalk.Core.Entities;
using SmartWalk.Core.Interfaces;

namespace SmartWalk.Application.Handlers;

/// <summary>
/// Endpoint-specific handler.
/// </summary>
public sealed class SearchPlacesHandler : IQueryHandler<SearchPlacesQuery, List<Place>>
{
    private readonly IEntityIndex _entityIndex;

    public SearchPlacesHandler(IEntityIndex entityIndex)
    {
        _entityIndex = entityIndex;
    }

    public Task<List<Place>> Handle(SearchPlacesQuery query)
    {
        return _entityIndex.GetAround(query.center, query.radius, query.categories);
    }
}
