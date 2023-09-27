using System.Collections.Generic;
using System.Threading.Tasks;
using SmartWalk.Model.Entities;

namespace SmartWalk.Model.Interfaces;

public interface IRoutingEngine
{
    /// <summary>
    /// Calculate polyline, distance, and duration of the fastest routes
    /// visiting waypoints in a given order.
    /// </summary>
    /// <returns>Non-null, possibly empty list of shortest path objects.</returns>
    Task<List<ShortestPath>> GetShortestPaths(IReadOnlyList<WgsPoint> waypoints);

    /// <summary>
    /// Calculate distance in meters between all pairs of waypoints (expected
    /// to be an expensive operation).
    /// </summary>
    Task<IDistanceMatrix> GetDistanceMatrix(IReadOnlyList<WgsPoint> waypoints);
}
