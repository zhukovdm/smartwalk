using System.Collections.Generic;

namespace osm;

internal static class Cartesian
{
    /// <summary>
    /// Calcuate signed area of a closed polygon in the Euclidean space.
    /// Positive area means that points are ordered counter-clockwise,
    /// negative otherwise.
    /// <list>
    /// <item>http://paulbourke.net/geometry/polygonmesh/</item>
    /// </list>
    /// </summary>
    /// <param name="polygon">Closed polygon (first and last points are identical!).</param>
    private static double SignedArea(List<Point> polygon)
    {
        double ar = 0.0;

        for (int i = 0; i < polygon.Count - 1; ++i)
        {
            var p0 = polygon[i];
            var p1 = polygon[i + 1];

            var (x0, y0) = (p0.lon, p0.lat);
            var (x1, y1) = (p1.lon, p1.lat);

            ar += x0 * y1 - y0 * x1;
        }

        return 0.5 * ar;
    }

    public static bool IsCounterClockwise(List<Point> polygon) => SignedArea(polygon) > 0.0;

    /// <summary>
    /// Calculate the centroid of a closed polygon in the Euclidean space.
    /// <list>
    /// <item>http://paulbourke.net/geometry/polygonmesh/</item>
    /// </list>
    /// </summary>
    /// <param name="polygon">Closed polygon (first and last points are identical!).</param>
    public static Point Centroid(List<Point> polygon)
    {
        double ar = 0.0, cx = 0.0, cy = 0.0;

        for (int i = 0; i < polygon.Count - 1; ++i)
        {
            var p0 = polygon[i];
            var p1 = polygon[i + 1];

            var (x0, y0) = (p0.lon, p0.lat);
            var (x1, y1) = (p1.lon, p1.lat);

            ar += x0 * y1 - y0 * x1;

            var im = x0 * y1 - y0 * x1;
            cx += (x0 + x1) * im;
            cy += (y0 + y1) * im;
        }

        // ar = 2*area ~> 3.0 instead of 6.0

        return new() { lon = cx / (3.0 * ar), lat = cy / (3.0 * ar) };
    }
}
