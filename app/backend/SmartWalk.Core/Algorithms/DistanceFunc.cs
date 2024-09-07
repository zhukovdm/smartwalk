using System.Collections.Generic;
using SmartWalk.Core.Entities;
using SmartWalk.Core.Interfaces;

namespace SmartWalk.Core.Algorithms;

/// <summary>
/// Wrapper over matrix-based distance function.
/// </summary>
public sealed class MatrixDistanceFunc : IDistanceFunc
{
    private readonly List<List<double>> matrix;

    public MatrixDistanceFunc(List<List<double>> matrix) { this.matrix = matrix; }

    public double GetDistance(int fr, int to) => matrix[fr][to];
}

/// <summary>
/// Scaled wrapper over the Haversine formula.
/// </summary>
public sealed class HaversineDistanceFunc : IDistanceFunc
{
    private readonly double scaleFactor;
    private readonly IReadOnlyList<Place> places;

    public HaversineDistanceFunc(IReadOnlyList<Place> places, double scaleFactor = 1.0)
    {
        this.places = places; this.scaleFactor = scaleFactor;
    }

    public double GetDistance(int fr, int to)
    {
        return Spherical.HaversineDistance(places[fr].location, places[to].location) * scaleFactor;
    }
}
