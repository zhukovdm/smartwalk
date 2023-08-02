using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SmartWalk.Core.Algorithms;
using SmartWalk.Core.Solvers;
using SmartWalk.Domain.Entities;
using SmartWalk.Domain.Interfaces;

namespace SmartWalk.Service;

public static class SearchService
{
    public static Task<List<Place>> GetPlaces(
        IEntityIndex index, WgsPoint center, double radius, List<Category> categories, int offset, int bucket)
    {
        return index.GetAround(center, radius, categories, offset, bucket);
    }

    public static Task<List<ShortestPath>> GetDirecs(IRoutingEngine engine, List<WgsPoint> waypoints)
    {
        return engine.GetShortestPath(waypoints);
    }

    /// <summary>
    /// Consider at most quantity places in each category.
    /// </summary>
    private static readonly int BUCKET_SIZE = 20;

    /// <summary>
    /// Find up to COUNT routes.
    /// </summary>
    private static readonly int ROUTES_COUNT = 10;

    /// <summary>
    /// Selector between Routing Engine (precise) and Haversine (approximate)
    /// distance matrices.
    /// </summary>
    private static readonly int DISTANCE_MATRIX_THRESHOLD = 3;

    /// <summary>
    /// Construct properly ordered continuous sequence.
    /// </summary>
    private static List<T> Concat<T>(T source, IEnumerable<T> waypoints, T target)
        => new List<T>().Concat(new[] { source }).Concat(waypoints).Concat(new[] { target }).ToList();

    /// <summary>
    /// Extract waypoints out of the route sequence. Skip first and last items
    /// (source and target).
    /// </summary>
    private static List<Place> Extract(List<int> route, List<Place> places)
        => route.Skip(1).SkipLast(1).Select(i => places[i]).ToList();

    public async static Task<List<Route>> GetRoutes(
        IEntityIndex index, IRoutingEngine engine, WgsPoint source, WgsPoint target,
        double maxDistance, List<Category> categories, List<PrecedenceEdge> precedence)
    {
        /* Get list of places and locations within bounding ellipse. Note that
         * the source and target are part of the list. */

        var ellipse = Spherical.BoundingEllipse(source, target, maxDistance);

        var around = await index.GetAroundWithin(
            ellipse, Spherical.Midpoint(source, target), maxDistance / 2.0, categories, BUCKET_SIZE);

        if (around is null) { return null; }

        var places = Concat(new Place() { location = source }, around, new Place() { location = target });
        var locations = places.Select(place => place.location).ToList();

        // Obtain distance matrix.

        var matrix = categories.Count <= DISTANCE_MATRIX_THRESHOLD
            ? (await engine.GetDistanceMatrix(locations))
            : (new HaversineDistanceMatrix(locations));

        if (matrix is null) { return null; }

        // Construct waypoint sequences.

        var sequences = (precedence.Count == 0)
            ? (RelaxedSolver.Solve(places, matrix, maxDistance, ROUTES_COUNT))
            : (PrecedenceSolver.Solve(places, matrix, precedence, maxDistance, ROUTES_COUNT));

        // Construct polylines.

        var polylines = new List<ShortestPath>();

        for (var i = 0; i < sequences.Count; ++i)
        {
            var path = await engine.GetShortestPath(sequences[i].Select(w => locations[w]).ToList());

            if (path.Count == 0) { return null; }

            polylines.Add(path[0]);
        }

        // Finalize route objects.

        return Enumerable.Range(0, sequences.Count).Aggregate(new List<Route>(), (acc, i) => {
            acc.Add(new() { path = polylines[i], waypoints = Extract(sequences[i], places) }); return acc; });
    }
}
