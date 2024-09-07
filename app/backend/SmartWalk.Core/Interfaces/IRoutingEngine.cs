using System.Collections.Generic;
using System.Threading.Tasks;
using SmartWalk.Core.Entities;

namespace SmartWalk.Core.Interfaces;

public interface IRoutingEngine
{
    /// <summary>
    /// Calculate distance in meters between all pairs of waypoints (expected
    /// to be an expensive operation).
    /// </summary>
    Task<IDistanceFunction> GetDistanceFunction(IReadOnlyList<WgsPoint> waypoints);

    /// <summary>
    /// Calculate paths (with polyline, distance, and duration) visiting
    /// waypoints in a given order.
    /// </summary>
    /// <returns>Non-null, possibly empty list of paths.</returns>
    Task<List<Path>> GetPaths(IReadOnlyList<WgsPoint> waypoints);
}
