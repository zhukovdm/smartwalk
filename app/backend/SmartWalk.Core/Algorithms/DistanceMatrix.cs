using System.Collections.Generic;
using SmartWalk.Domain.Entities;
using SmartWalk.Domain.Interfaces;

namespace SmartWalk.Core.Algorithms;

/// <summary>
/// Wrapper over list-based distance matrix calculated by a routing engine.
/// </summary>
public sealed class ListDistanceMatrix : IDistanceMatrix
{
    private readonly List<List<double>> _matrix;

    public ListDistanceMatrix(List<List<double>> matrix) { _matrix = matrix; }

    public int Count => _matrix.Count;

    public double GetDistance(int fr, int to) => _matrix[fr][to];
}

/// <summary>
/// Scaled wrapper over the Haversine formula.
/// </summary>
public sealed class HaversineDistanceMatrix : IDistanceMatrix
{
    private readonly double _scaleFactor;
    private readonly List<Place> _places;

    public HaversineDistanceMatrix(List<Place> places, double scaleFactor = 1.0)
    {
        _places = places; _scaleFactor = scaleFactor;
    }

    public int Count => _places.Count;

    public double GetDistance(int fr, int to)
        => Spherical.HaversineDistance(_places[fr].location, _places[to].location) * _scaleFactor;
}
