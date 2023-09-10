using System.IO;

namespace osm;

internal static class PathBuilder
{
    private static readonly string ASSETS_BASE_ADDR = Path.Combine(new string[]
    {
        "..",
        "assets"
    });

    internal static string GetOsmFilePath(string fileName) => Path.Combine(new string[]
    {
        ASSETS_BASE_ADDR,
        "osm-maps",
        fileName
    });

    internal static string GetTaginfoFilePath(string fileName) => Path.Combine(new string[]
    {
        ASSETS_BASE_ADDR,
        "taginfo",
        fileName + ".json"
    });
}
