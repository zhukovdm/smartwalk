using System.Collections.Generic;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using SmartWalk.Core.Algorithms;
using SmartWalk.Core.Entities;
using SmartWalk.Core.Extensions;
using SmartWalk.Core.Heuristics;

namespace SmartWalk.Core.Test;

[TestClass]
public class IfCategoryFormerTests
{
    private static readonly int N = 5;

    [TestMethod]
    public void ShouldGroupPlacesByCategory()
    {
        var cats = IfCategoryFormer.Form(TestPrimitives.GetWaypoints(N));

        Assert.AreEqual(cats.Count, 5);

        foreach (var cat in cats)
        {
            var first = cat.FirstOrDefault();

            foreach (var place in cat)
            {
                Assert.AreEqual(first?.cat, place.cat);
            }
        }
    }

    [TestMethod]
    public void ShouldPrioritizeCategoriesWithLessItems()
    {
        var cats = IfCategoryFormer.Form(TestPrimitives.GetWaypoints(N));

        foreach (var (l, r) in cats.Zip(cats.Skip(1)))
        {
            Assert.IsTrue(l.Count < r.Count);
        }
        Assert.AreEqual(cats[ 0][0].cat, N - 1);
        Assert.AreEqual(cats[^1][0].cat, 0);
    }
}

[TestClass]
public class IfCandidateSelectorTests
{
    [TestMethod]
    public void ShouldSelectCandidateWithTheSmallestImpactOnTheDistance()
    {
        var seq = new List<SolverPlace>()
        {
            new(4, 3), // s
            new(0, 0),
            new(3, 2), // <- insert here as d(2 -> 3) = 0.9
            new(5, 4), // t
        };

        var cat = new List<SolverPlace>()
        {
            new(1, 1),
            new(2, 1),
        };

        var matrix = TestPrimitives.GenerateUnitDistanceMatrix(6);
        matrix[2][3] = 0.9;

        var distFn = new MatrixDistanceFunc(matrix);

        var (best, _, _) = IfCandidateSelector.SelectBest(seq, cat, distFn, 0.0);

        Assert.AreEqual(2, best.idx);
    }
}

[TestClass]
public class IfHeuristicTests
{
    [TestMethod]
    public void ShouldUseNonConsecutiveCategories()
    {
        var places = new List<SolverPlace>()
        {
            new(0, 0),
            new(1, 1),
        //  new(2, 2),
        //  new(3, 3),
            new(4, 4),
            new(5, 5),
        };

        var source = new SolverPlace(6, 6);
        var target = new SolverPlace(7, 7);

        var order = 8;

        var distFn = TestPrimitives.GenerateRandomDistanceMatrix(order);
        var result = IfHeuristic.Advise(places, distFn, source, target);

        Assert.AreEqual(places.Count + 2, result.Count);
    }

    [TestMethod]
    [DataRow(0.0)]
    [DataRow(0.2)]
    [DataRow(0.4)]
    [DataRow(0.6)]
    [DataRow(0.8)]
    [DataRow(1.0)]
    public void ShouldAdviceValidSequenceForRandomGraph(double probability)
    {
        var N = 100;

        var source = new SolverPlace(N, N);
        var target = new SolverPlace(N + 1, N + 1);

        var order = N + 2;

        var places = Enumerable
            .Range(0, N)
            .ToList()
            .DurstenfeldShuffle()
            .Select((idx) => new SolverPlace(idx, idx))
            .ToList();

        var distFn = TestPrimitives.GenerateRandomDistanceMatrix(order);

        var result = IfHeuristic.Advise(places, distFn, source, target);

        // length

        Assert.AreEqual(order, result.Count);

        // terminals

        Assert.AreEqual(result[ 0].cat, N);
        Assert.AreEqual(result[^1].cat, N + 1);
    }
}
