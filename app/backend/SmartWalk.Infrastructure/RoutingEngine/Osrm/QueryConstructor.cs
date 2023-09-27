using System.Collections.Generic;
using System.Linq;
using SmartWalk.Model.Entities;

namespace SmartWalk.Infrastructure.RoutingEngine.Osrm;

internal static class QueryConstructor
{
    private static string Chain(IReadOnlyList<WgsPoint> waypoints)
        => string.Join(';', waypoints.Select(w => w.lon.ToString() + ',' + w.lat.ToString()));

    /// <summary>
    /// Query fetching the <b>fastest</b> route connecting waypoints in a given order.
    /// </summary>
    public static string Route(string addr, IReadOnlyList<WgsPoint> waypoints)
        => addr + "/route/v1/foot/" + Chain(waypoints) + "?alternatives=true&geometries=geojson&skip_waypoints=true";

    /// <summary>
    /// Query fetching matrix with durations of the <b>fastest</b> routes between all pairs of waypoints.
    /// </summary>
    public static string Table(string addr, IReadOnlyList<WgsPoint> waypoints)
        => addr + "/table/v1/foot/" + Chain(waypoints) + "?annotations=duration&skip_waypoints=true";
}
