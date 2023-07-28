using System.IO;

namespace osm;

internal static class Constants
{
    public static readonly string MONGO_DATABASE = "grainpath";

    public static readonly string MONGO_GRAIN_COLLECTION = "grain";

    public static readonly string ASSETS_BASE_ADDR = string.Join(Path.DirectorySeparatorChar, new[] { "..", "assets" });

    public static readonly string RESOURCES_BASE_ADDR = "Resources";
}
