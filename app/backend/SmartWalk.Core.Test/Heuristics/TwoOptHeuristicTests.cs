using System;
using System.Collections.Generic;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using SmartWalk.Core.Heuristics;
using SmartWalk.Domain.Entities;
using SmartWalk.Domain.Interfaces;

namespace SmartWalk.Core.Test;

[TestClass]
public class TwoOptHeuristicTests
{
    private sealed class Point
    {
        public double X { get; }

        public double Y { get; }

        public Point(double x, double y) { X = x; Y = y; }
    }

    private sealed class CartesianDistanceMatrix : IDistanceMatrix
    {
        private readonly List<Point> _points;

        public CartesianDistanceMatrix(List<Point> points)
        {
            _points = points;
        }

        public int Count => _points.Count;

        public double GetDistance(int fr, int to)
        {
            var l = _points[fr];
            var r = _points[to];
            return Math.Sqrt(Math.Pow(r.X - l.X, 2) + Math.Pow(r.Y - l.Y, 2));
        }
    }

    [TestMethod]
    public void ShouldResolveIntersectingSegments()
    {
        var distMatrix = new CartesianDistanceMatrix(new()
        {
            new(0.0, 0.0),
            new(0.0, 1.0),
            new(1.0, 1.0),
            new(1.0, 0.0),
        });

        var seq = TwoOptHeuristic.Refine(new List<SolverPlace>
        {
            new(0, 0),
            new(2, 2),
            new(1, 1),
            new(3, 3),
        }, distMatrix);

        var ans = new List<int> { 0, 1, 2, 3 };

        Assert.AreEqual(ans.Count, seq.Count);

        for (int i = 0; i < ans.Count; ++i)
        {
            Assert.AreEqual(ans[i], seq[i].idx);
        }
    }
}
