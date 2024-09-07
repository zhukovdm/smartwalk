using System.Collections.Generic;
using System.Threading.Tasks;
using SmartWalk.Core.Entities;

namespace SmartWalk.Application.Interfaces;

public interface IShortestPathFinder
{
    /// <summary>
    /// Find paths connecting an ordered sequence of waypoints.
    /// </summary>
    /// <param name="waypoints">Ordered sequence of points</param>
    /// <returns>List of paths.</returns>
    Task<List<ShortestPath>> Search(IReadOnlyList<WgsPoint> waypoints);
}
