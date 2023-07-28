namespace osm;

/// <summary>
/// EPSG:3857 bounds, see https://epsg.io/3857.
/// </summary>
internal static class CrsEpsg3857
{
    public static double BoundLon => 180.0;

    public static double BoundLat => 85.06;

    public static bool IsWithin(double lon, double lat)
    {
        return lon >= -BoundLon && lon <= +BoundLon
            && lat >= -BoundLat && lat <= +BoundLat;
    }
}
