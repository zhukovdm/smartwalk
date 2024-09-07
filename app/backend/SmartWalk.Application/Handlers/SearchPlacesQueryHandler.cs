using System.Collections.Generic;
using System.Threading.Tasks;
using SmartWalk.Application.Entities;
using SmartWalk.Core.Entities;
using SmartWalk.Core.Interfaces;

namespace SmartWalk.Application.Handlers;

/// <summary>
/// Endpoint-specific query handler.
/// </summary>
public sealed class SearchPlacesQueryHandler : ISearchPlacesQueryHandler
{
    private readonly IEntityIndex entityIndex;

    public SearchPlacesQueryHandler(IEntityIndex entityIndex)
    {
        this.entityIndex = entityIndex;
    }

    public Task<List<Place>> Handle(SearchPlacesQuery query)
    {
        return entityIndex.GetAround(query.center, query.radius, query.categories);
    }
}
