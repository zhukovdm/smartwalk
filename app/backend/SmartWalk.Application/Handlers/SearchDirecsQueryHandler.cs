using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SmartWalk.Application.Entities;
using SmartWalk.Application.Helpers;
using SmartWalk.Application.Interfaces;
using SmartWalk.Core.Entities;

namespace SmartWalk.Application.Handlers;

/// <summary>
/// Endpoint-specific query handler.
/// </summary>
public sealed class SearchDirecsQueryHandler : ISearchDirecsQueryHandler
{
    private readonly IShortestPathFinder shortestPathFinder;

    public SearchDirecsQueryHandler(IShortestPathFinder shortestPathFinder)
    {
        this.shortestPathFinder = shortestPathFinder;
    }

    public async Task<List<ShortestPath>> Handle(SearchDirecsQuery query)
    {
        return (await shortestPathFinder.Search(query.waypoints))
            .OrderBy(s => s, ShortestPathComparer.Instance)
            .ToList();
    }
}
