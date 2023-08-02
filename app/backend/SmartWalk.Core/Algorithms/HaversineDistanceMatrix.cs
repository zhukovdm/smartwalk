using System.Collections.Generic;
using SmartWalk.Domain.Entities;
using SmartWalk.Domain.Interfaces;

namespace SmartWalk.Core.Algorithms;

/// <summary>
/// <b>Scaled</b> wrapper over Haversine formula.
/// </summary>
public sealed class HaversineDistanceMatrix : IDistanceMatrix
{
    private static readonly double SCALE_FACTOR = 1.0;
    private readonly List<WgsPoint> _points;

    public HaversineDistanceMatrix(List<WgsPoint> points) { _points = points; }

    public double Distance(int fr, int to)
        => Spherical.HaversineDistance(_points[fr], _points[to]) * SCALE_FACTOR;
}
