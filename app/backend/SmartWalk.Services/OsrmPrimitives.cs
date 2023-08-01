using System;

namespace SmartWalk.Services;

internal static class OsrmPrimitives
{
    public static readonly string BASE_URL
        = Environment.GetEnvironmentVariable("SMARTWALK_OSRM_BASE_URL") ?? "http://localhost:5000";
}
