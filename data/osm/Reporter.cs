using OsmSharp;
using System;
using System.Text.Json;

namespace osm;

internal static class Reporter
{
    private static readonly JsonSerializerOptions opts = new() { WriteIndented = true };

    private static string Serialize<T>(T entity)
    {
        return JsonSerializer.Serialize<T>(entity, opts);
    }

    public static void ThrowOnUndefined<T>(T t, string label)
    {
        throw new ArgumentException($"Undefined {label} detected." + Environment.NewLine + $"{Serialize(t)}");
    }

    public static void ThrowOnOutbound(Node node)
    {
        throw new ArgumentException($"Outbound node detected." + Environment.NewLine + $"{Serialize(node)}");
    }
}
