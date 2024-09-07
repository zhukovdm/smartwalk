using System.Collections.Generic;
using System.Threading.Tasks;
using SmartWalk.Core.Entities;

namespace SmartWalk.Application.Interfaces;

public interface IDistanceFuncFinder
{
    /// <summary>
    /// Find distances (in meters) of the fastest routes between all
    /// pairs of waypoints.
    /// </summary>
    /// <param name="waypoints">Sequence of points</param>
    /// <returns>Possibly null table of distances</returns>
    Task<List<List<double>>> Search(IReadOnlyList<WgsPoint> waypoints);
}
