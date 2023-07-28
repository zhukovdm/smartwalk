using OsmSharp;
using System;
using System.Text.Json;

namespace osm;

internal static class Reporter
{
    private static string Serialize<T>(T entity)
    {
        var opts = new JsonSerializerOptions() { WriteIndented = true };
        return JsonSerializer.Serialize<T>(entity, opts);
    }

    public static void ReportUndefined(Node node)
    {
        throw new ArgumentException($"Undefined node detected." + Environment.NewLine + $"{Serialize(node)}");
    }

    public static void ReportOutbound(Node node)
    {
        throw new ArgumentException($"Outbound node detected." + Environment.NewLine + $"{Serialize(node)}");
    }

    public static void ReportUndefined(Way way)
    {
        throw new ArgumentException($"Undefined way detected." + Environment.NewLine + $"{Serialize(way)}");
    }
}
