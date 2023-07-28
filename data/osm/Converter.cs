using System;
using System.Collections.Generic;
using System.Linq;

namespace osm;

internal static class Converter
{
    public static string SnakeToKeyword(string snake) => snake.Replace('_', ' ');

    public static (double, double, double, double) ToBbox(List<string> bbox)
    {
        if (bbox is null || bbox.Count == 0)
        {
            return (-CrsEpsg3857.BoundLon, +CrsEpsg3857.BoundLat, +CrsEpsg3857.BoundLon, -CrsEpsg3857.BoundLat);
        }

        var errMsg = "The value of --bbox switch shall be in the format [w n e s] within https://epsg.io/3857.";

        if (bbox.Count != 4) { throw new Exception(errMsg); }
        var coords = bbox.Select(t => double.Parse(t)).ToList();

        return (Math.Max(Math.Min(coords[0], coords[2]), -CrsEpsg3857.BoundLon),
                Math.Min(Math.Max(coords[1], coords[3]), +CrsEpsg3857.BoundLat),
                Math.Min(Math.Max(coords[0], coords[2]), +CrsEpsg3857.BoundLon),
                Math.Max(Math.Min(coords[1], coords[3]), -CrsEpsg3857.BoundLat));
    }
}
