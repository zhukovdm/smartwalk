using System.Collections.Generic;
using SmartWalk.Application.Helpers;
using SmartWalk.Application.Interfaces;
using SmartWalk.Core.Algorithms;
using SmartWalk.Core.Entities;

namespace SmartWalk.Application.Parsers;

/// <summary>
/// Parser specific for /search/routes requests.
/// </summary>
public sealed class SearchRoutesQueryParser : QueryParserBase<ConstrainedSearchRoutesQuery, SearchRoutesQuery>
{
    /// <summary>
    /// Check if edges define directed acyclic loop-free graph, repeated edges
    /// are NOT tolerable.
    /// </summary>
    /// <param name="arrows">User-defined ordering on categories.</param>
    /// <param name="order">Number of categories.</param>
    /// <param name="error">Possible error.</param>
    /// <returns></returns>
    internal static bool ValidateArrows(IEnumerable<Arrow> arrows, int order, out string error)
    {
        error = null;

        var cycleDetector = new CycleDetector(order);
        var uniqueArrows = new SortedSet<Arrow>(ArrowComparer.Instance);

        foreach (var arrow in arrows)
        {
            if (arrow.fr >= order || arrow.to >= order)
            {
                error = $"Arrow {arrow.fr} → {arrow.to} contains an out-of-bound terminal point.";
                return false;
            }

            if (arrow.fr == arrow.to)
            {
                error = $"Arrow {arrow.fr} → {arrow.to} is a loop.";
                return false;
            }

            if (!uniqueArrows.Add(arrow))
            {
                error = $"Repeated arrow {arrow.fr} → {arrow.to} detected.";
                return false;
            }
            cycleDetector.AddEdge(arrow.fr, arrow.to);
        }

        var cycle = cycleDetector.Cycle();

        if (cycle is not null)
        {
            error = $"Cycle {string.Join(" → ", cycle)} detected.";
            return false;
        }
        return true;
    }

    /// <summary>
    /// False if the crow-fly distance between a source and target exceeds
    /// maximum allowed distance (network distance >= crow-fly distance).
    /// </summary>
    /// <param name="source">Starting point.</param>
    /// <param name="target">Destination.</param>
    /// <param name="maxDistance">Maximum allowed distance (in meters).</param>
    /// <returns></returns>
    internal static bool ValidateRouteMaxDistance(WgsPoint source, WgsPoint target, double maxDistance)
    {
        return Spherical.HaversineDistance(source, target) <= maxDistance;
    }

    protected override bool PostValidate(IErrors parseErrors, SearchRoutesQuery query)
    {
        if (!ValidateArrows(query.arrows, query.categories.Count, out var arrowError))
        {
            parseErrors.Add("query", arrowError);
            return false;
        }

        if (!ValidateRouteMaxDistance(query.source, query.target, query.maxDistance))
        {
            parseErrors.Add("query", "Starting point and destination are too far from each other.");
            return false;
        }
        return true;
    }
}
