using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using SmartWalk.Core.Entities;
using SmartWalk.Core.Extensions;
using SmartWalk.Core.Heuristics;
using SmartWalk.Core.Interfaces;

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

    private sealed class CartesianDistanceFunc : IDistanceFunc
    {
        private readonly List<Point> points;

        public CartesianDistanceFunc(List<Point> points)
        {
            this.points = points;
        }

        public int Count => points.Count;

        public double GetDistance(int fr, int to)
        {
            var l = points[fr];
            var r = points[to];
            return Math.Sqrt(Math.Pow(r.X - l.X, 2) + Math.Pow(r.Y - l.Y, 2));
        }
    }

    [TestMethod]
    public void ShouldResolveIntersectingSegments()
    {
        // there is only one correct answer

        var distFn = new CartesianDistanceFunc(new()
        {
            new(0.0, 0.0),
            new(0.0, 1.0),
            new(1.0, 1.0),
            new(1.0, 0.0),
        });

        var seq = TwoOptHeuristic.Advise(new List<SolverPlace>
        {
            new(0, 0),
            new(2, 2),
            new(1, 1),
            new(3, 3),
        }, distFn);

        var ans = new List<int> { 0, 1, 2, 3 };

        Assert.AreEqual(ans.Count, seq.Count);

        for (int i = 0; i < ans.Count; ++i)
        {
            Assert.AreEqual(ans[i], seq[i].idx);
        }
    }

    [TestMethod]
    [DataRow(3)]
    [DataRow(5)]
    [DataRow(10)]
    [DataRow(20)]
    [DataRow(50)]
    [DataRow(100)]
    public void ShouldIntroduceAcceptableChangesIntoSequence(int order)
    {
        var rnd = new Random();

        var points = Enumerable
            .Range(0, order)
            .Select((_) => new Point(rnd.NextDouble(), rnd.NextDouble()))
            .ToList();

        var distFn = new CartesianDistanceFunc(points);

        var seq = Enumerable
            .Range(0, order)
            .Select((idx) => new SolverPlace(idx, idx))
            .ToList()
            .DurstenfeldShuffle();

        var calculateDistance = (List<SolverPlace> sequence) =>
        {
            var result = 0.0;

            foreach (var (l, r) in sequence.Zip(sequence.Skip(1)))
            {
                result += distFn.GetDistance(l.idx, r.idx);
            }
            return result;
        };

        var source0 = seq[ 0];
        var target0 = seq[^1];
        var distance0 = calculateDistance(seq);

        seq = TwoOptHeuristic.Advise(seq, distFn);

        var distanceAfter = calculateDistance(seq);

        var source1 = seq[ 0];
        var target1 = seq[^1];
        var distance1 = calculateDistance(seq);

        Assert.AreEqual(source0.idx, source1.idx);
        Assert.AreEqual(target0.idx, target1.idx);
        Assert.IsTrue(distance1 <= distance0);
    }
}
