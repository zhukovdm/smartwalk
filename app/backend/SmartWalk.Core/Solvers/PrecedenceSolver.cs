using System.Collections.Generic;
using SmartWalk.Core.Heuristics;
using SmartWalk.Domain.Entities;
using SmartWalk.Domain.Interfaces;

namespace SmartWalk.Core.Solvers;

public sealed class PrecedenceSolver : SolverBase
{
    private PrecedenceSolver() { }

    private static (List<int>, SortedSet<int>) SimplifyOgRoute(List<int> ogRoute)
    {
        var occur = new SortedSet<int>();
        foreach (var ogIndex in ogRoute) { occur.Add(ogIndex); }

        return (ogRoute, occur);
    }

    public static List<List<int>> Solve(
        IReadOnlyList<Place> places, IDistanceMatrix matrix, List<PrecedenceEdge> precedence, double maxDistance, int routesCount)
    {
        var routes = new List<List<int>>();
        var solverPlaces = PlaceConverter.Convert(places);

        for (int i = 0; i < routesCount; ++i)
        {
            var ogRoute = OgHeuristic.Advise(solverPlaces, matrix, precedence, maxDistance, places.Count);

            if (ogRoute.Count < 3) { break; } // no more good places remained

            var (route, occur) = SimplifyOgRoute(ogRoute);

            routes.Add(route);
            solverPlaces = FilterPlaces(solverPlaces, occur);
        }

        return routes;
    }
}
