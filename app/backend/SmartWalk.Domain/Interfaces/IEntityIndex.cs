using System.Collections.Generic;
using System.Threading.Tasks;
using SmartWalk.Domain.Entities;

namespace SmartWalk.Domain.Interfaces;

public interface IEntityIndex
{
    /// <summary>
    /// Find places around a point satisfying specific categories.
    /// </summary>
    /// <param name="categories">Categories provided by the user.</param>
    /// <param name="center">Geodetic point on the Earth.</param>
    /// <param name="radius">The maximum distance from the center (in meters).</param>
    /// <param name="offset">Skip first <c>offset</c> places.</param>
    /// <param name="bucket">Get at most <c>bucket</c> places.</param>
    /// <returns>Non-null, possibly empty list of places.</returns>
    public Task<List<Place>> GetAround(
        IReadOnlyList<Category> categories, WgsPoint center, double radius, int offset, int bucket);

    /// <summary>
    /// Find places satisfying specific categories within a polygon closed to
    /// the reference point.
    /// </summary>
    /// <param name="categories">Categories provided by the user.</param>
    /// <param name="polygon">Closed polygon (an approximation of a bounding ellipse).</param>
    /// <param name="refPoint">Reference center point (the centroid of the polygon).</param>
    /// <param name="distance">Maximum distance from the reference point (in meters).</param>
    /// <param name="bucket">Get at most <c>bucket</c> places for each category.</param>
    /// <returns>Non-null, possibly empty list of places.</returns>
    public Task<List<Place>> GetAroundWithin(
        IReadOnlyList<Category> categories, List<WgsPoint> polygon, WgsPoint refPoint, double distance, int bucket);
}
