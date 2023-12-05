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
public sealed class SearchDirecsHandler : IQueryHandler<SearchDirecsQuery, List<ShortestPath>>
{
    private readonly IRoutingEngine routingEngine;

    public SearchDirecsHandler(IRoutingEngine routingEngine)
    {
        this.routingEngine = routingEngine;
    }

    public Task<List<ShortestPath>> Handle(SearchDirecsQuery query)
    {
        return routingEngine.GetShortestPaths(query.waypoints);
    }
}
