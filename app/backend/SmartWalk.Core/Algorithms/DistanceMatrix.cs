using System.Collections.Generic;
using SmartWalk.Domain.Entities;
using SmartWalk.Domain.Interfaces;

namespace SmartWalk.Core.Algorithms;

/// <summary>
/// Scaled wrapper over Haversine formula.
/// </summary>
public sealed class HaversineDistanceMatrix : IDistanceMatrix
{
    private readonly double _scaleFactor;
    private readonly List<Place> _places;

    public HaversineDistanceMatrix(List<Place> places, double scaleFactor = 1.0)
    {
        _places = places; _scaleFactor = scaleFactor;
    }

    public double GetDistance(int fr, int to)
        => Spherical.HaversineDistance(_places[fr].location, _places[to].location) * _scaleFactor;
}
