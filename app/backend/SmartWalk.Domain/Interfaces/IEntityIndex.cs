using System.Collections.Generic;
using System.Threading.Tasks;
using SmartWalk.Domain.Entities;

namespace SmartWalk.Domain.Interfaces;

public interface IEntityIndex
{
    /// <summary>
    /// Find places around a point satisfying specific categories.
    /// </summary>
    /// <param name="center">Geodetic point on the Earth.</param>
    /// <param name="radius">The maximum distance from the center (in meters).</param>
    /// <param name="categories">Categories provided by the user.</param>
    /// <returns>Non-null, possibly empty list of places.</returns>
    public Task<List<Place>> GetAround(
        WgsPoint center, double radius, List<Category> categories);

    /// <summary>
    /// Find places satisfying specific categories within a polygon closed to
    /// the reference point.
    /// </summary>
    /// <param name="polygon">Closed polygon (an approximation of a bounding ellipse).</param>
    /// <param name="refPoint">Reference center point (the centroid of a polygon).</param>
    /// <param name="distance">Maximum distance from the reference point (in meters).</param>
    /// <param name="categories">Categories provided by the user.</param>
    /// <returns>Non-null, possibly empty list of places.</returns>
    public Task<List<Place>> GetAroundWithin(
        List<WgsPoint> polygon, WgsPoint refPoint, double distance, List<Category> categories);
}
