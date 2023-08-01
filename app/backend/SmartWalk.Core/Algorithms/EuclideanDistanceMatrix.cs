using System;
using System.Collections.Generic;
using SmartWalk.Domain.Entities;
using SmartWalk.Domain.Interfaces;

namespace SmartWalk.Core.Algorithms;

internal sealed class EuclideanDistanceMatrix : IDistanceMatrix
{
    private readonly List<CartesianPoint> _points;

    public EuclideanDistanceMatrix(List<CartesianPoint> points) { _points = points; }

    public double Distance(int fr, int to)
        => Math.Sqrt(Math.Pow(_points[fr].x - _points[to].x, 2.0) + Math.Pow(_points[fr].y - _points[to].y, 2.0));
}
