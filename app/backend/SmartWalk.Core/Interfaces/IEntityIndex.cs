using System.Collections.Generic;
using System.Threading.Tasks;
using SmartWalk.Core.Entities;

namespace SmartWalk.Core.Interfaces;

public interface IEntityIndex
{
    /// <summary>
    /// Find places around a point satisfying specific categories ordered by
    /// the crow-fly distances from the center point.
    /// </summary>
    /// <param name="center">Geodetic point on the Earth.</param>
    /// <param name="radius">The maximum distance from the center (in meters).</param>
    /// <param name="categories">Categories provided by the user.</param>
    /// <returns>Non-null, possibly empty list of places.</returns>
    Task<List<Place>> GetAround(WgsPoint center, double radius, IReadOnlyList<Category> categories);

    /// <summary>
    /// Find places satisfying specific categories within a polygon. The resulting
    /// collection is NOT ordered by the distance.
    /// </summary>
    /// <param name="polygon">Closed polygon (an approximation of a bounding ellipse).</param>
    /// <param name="categories">Categories provided by the user.</param>
    /// <returns>Non-null, possibly empty list of places.</returns>
    Task<List<Place>> GetWithin(IReadOnlyList<WgsPoint> polygon, IReadOnlyList<Category> categories);
}
