using System.Collections.Generic;
using System.Threading.Tasks;
using SmartWalk.Model.Entities;

namespace SmartWalk.Infrastructure.RoutingEngine.Osrm;

internal interface IOsrmRouteFetcher
{
    /// <summary>
    /// <list>
    /// <item>http://project-osrm.org/docs/v5.24.0/api/#route-service</item>
    /// </list>
    /// </summary>
    /// <param name="waypoints">Ordered sequence of points</param>
    /// <returns>List of <b>fastest</b> routes</returns>
    Task<List<OsrmRoute>> Fetch(IEnumerable<WgsPoint> waypoints);
}
