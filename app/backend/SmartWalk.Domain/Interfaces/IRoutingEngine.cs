using System.Collections.Generic;
using System.Threading.Tasks;
using SmartWalk.Domain.Entities;

namespace SmartWalk.Domain.Interfaces;

public interface IRoutingEngine
{
    /// <summary>
    /// Calculate polyline, distance, and duration of the fastest routes
    /// visiting waypoints in a given order.
    /// </summary>
    /// <returns>Non-null, possibly empty list of shortest path objects.</returns>
    public Task<List<ShortestPath>> GetShortestPaths(List<WgsPoint> waypoints);

    /// <summary>
    /// Calculate distance matrix, distance in meters between all pairs of points.
    /// </summary>
    public Task<IDistanceMatrix> GetDistanceMatrix(List<WgsPoint> waypoints);
}
