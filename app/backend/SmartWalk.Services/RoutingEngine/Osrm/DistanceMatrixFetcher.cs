using System.Collections.Generic;
using System.Text.Json;
using System.Threading.Tasks;
using SmartWalk.Domain.Entities;
using SmartWalk.Domain.Interfaces;

namespace SmartWalk.Services.RoutingEngine.Osrm;

/// <summary>
/// Simple wrapper over List-based distance matrix calculated by OSRM.
/// </summary>
internal sealed class OsrmDistanceMatrix : IDistanceMatrix
{
    private readonly List<List<double>> _matrix;

    public OsrmDistanceMatrix(List<List<double>> matrix) { _matrix = matrix; }

    public double Distance(int fr, int to) => _matrix[fr][to];
}

internal static class DistanceMatrixFetcher
{
    private static readonly double SPEED_COEFF = 5000.0 / 3600.0;

    private sealed class Answer
    {
        public string code { get; set; }

        public List<List<double>> durations { get; set; }
    }

    /// <summary>
    /// Request distance of the fastest paths between all pairs of waypoints.
    /// <list>
    /// <item>http://project-osrm.org/docs/v5.24.0/api/#responses</item>
    /// <item>http://project-osrm.org/docs/v5.24.0/api/#table-service</item>
    /// </list>
    /// </summary>
    /// <param name="addr">base URL of the service</param>
    /// <param name="waypoints">list of WGS84 points</param>
    /// <returns>distance matrix in meters</returns>
    public static async Task<IDistanceMatrix> Fetch(string addr, List<WgsPoint> waypoints)
    {
        var res = await QueryExecutor.Execute(QueryConstructor.Table(addr, waypoints));
        if (res is null) { return null; }

        var ans = JsonSerializer.Deserialize<Answer>(res);

        if (ans.code != "Ok" || ans.durations is null) { return null; }

        for (int r = 0; r < ans.durations.Count; ++r)
        {
            for (int c = 0; c < ans.durations.Count; ++c)
            {
                ans.durations[r][c] *= SPEED_COEFF;
            }
        }

        return new OsrmDistanceMatrix(ans.durations);
    }
}
