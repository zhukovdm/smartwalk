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

    public static void ReportUndefined<T>(T t, string label)
    {
        throw new ArgumentException($"Undefined {label} detected." + Environment.NewLine + $"{Serialize(t)}");
    }

    public static void ReportOutbound(Node node)
    {
        throw new ArgumentException($"Outbound node detected." + Environment.NewLine + $"{Serialize(node)}");
    }
}
