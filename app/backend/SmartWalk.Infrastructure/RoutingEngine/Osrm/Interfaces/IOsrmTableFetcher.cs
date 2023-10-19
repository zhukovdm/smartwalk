using System.Collections.Generic;
using System.Threading.Tasks;
using SmartWalk.Core.Entities;

namespace SmartWalk.Infrastructure.RoutingEngine.Osrm;

using Table = List<List<double>>;

internal interface IOsrmTableFetcher
{
    /// <summary>
    /// Request distances (in meters) of the fastest routes between all pairs
    /// of waypoints.
    /// <list>
    /// <item>http://project-osrm.org/docs/v5.24.0/api/#table-service</item>
    /// </list>
    /// </summary>
    /// <param name="waypoints">Sequence of points</param>
    /// <returns>Possibly null table of all-pairs shortest path</returns>
    Task<Table> Fetch(IEnumerable<WgsPoint> waypoints);
}
