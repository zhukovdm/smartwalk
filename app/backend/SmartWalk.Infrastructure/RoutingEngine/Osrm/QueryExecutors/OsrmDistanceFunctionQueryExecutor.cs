using System.Collections.Generic;
using System.Threading.Tasks;
using SmartWalk.Core.Algorithms;
using SmartWalk.Core.Entities;
using SmartWalk.Core.Interfaces;

namespace SmartWalk.Infrastructure.RoutingEngine.Osrm;

internal static class OsrmDistanceFunctionQueryExecutor
{
    public static async Task<IDistanceFunction> Execute(IOsrmTableFetcher fetcher, IReadOnlyList<WgsPoint> waypoints)
    {
        var table = await fetcher.Fetch(waypoints);
        return (table is not null) ? new MatrixDistanceFunction(table) : null;
    }
}
