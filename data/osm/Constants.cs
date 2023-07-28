using System.IO;

namespace osm;

internal static class Constants
{
    public static readonly string MONGO_DATABASE = "smartwalk";

    public static readonly string MONGO_PLACE_COLLECTION = "place";

    public static readonly string ASSETS_BASE_ADDR = string.Join(Path.DirectorySeparatorChar, new[] { "..", "assets" });
}
