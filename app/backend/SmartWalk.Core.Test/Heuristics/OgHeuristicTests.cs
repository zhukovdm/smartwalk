using System.Collections.Generic;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using SmartWalk.Core.Algorithms;
using SmartWalk.Core.Entities;
using SmartWalk.Core.Extensions;
using SmartWalk.Core.Heuristics;

namespace SmartWalk.Core.Test;

[TestClass]
public class OgCategoryFormerTests
{
    private static readonly int n = 5;

    [TestMethod]
    public void ShouldGroupPlacesByCategory()
    {
        // [(0 -> 2), (1 -> 2), (2 -> 3)]

        var places = TestPrimitives.GetWaypoints(n);

        var arrows = new List<Arrow>()
        {
            new (0, 2),
            new (1, 2),
            new (2, 3),
        };

        var cats = OgCategoryFormer.Form(places, arrows);

        // places

        foreach (var cat in cats)
        {
            var obj = cat.Value;
            Assert.AreEqual(obj.places.Count, n - cat.Key);
        }

        // predecessors

        Assert.AreEqual(0, cats[0].pred);
        Assert.AreEqual(0, cats[1].pred);
        Assert.AreEqual(2, cats[2].pred);
        Assert.AreEqual(1, cats[3].pred);
        Assert.AreEqual(0, cats[4].pred);

        // successors

        Assert.AreEqual(1, cats[0].succ.Count);
        Assert.AreEqual(1, cats[1].succ.Count);
        Assert.AreEqual(1, cats[2].succ.Count);
        Assert.AreEqual(0, cats[3].succ.Count);
        Assert.AreEqual(0, cats[4].succ.Count);
    }
}

[TestClass]
public class OgCandidateSelectorTests
{
    [TestMethod]
    public void ShouldSelectCandidateWithTheSmallestImpactOnTheDistance()
    {
        // [(0 -> 1), (0 -> 2), (0 -> 3)]

        var seq = new List<SolverPlace>
        {
            new (4, 4), // s
            new (0, 0),
            new (5, 5), // t
        };

        var p1 = new OgCategory();
        p1.places.Add(new (1, 1));

        var p2 = new OgCategory();
        p2.places.Add(new (2, 2));

        var p3 = new OgCategory();
        p3.places.Add(new (3, 3));

        var cats = new List<OgCategory> { p1, p2, p3 };

        var distFn = new MatrixDistanceFunc(new ()
        {
            new () { 0.0, 2.0, 1.0, 3.0, 0.0, 0.0 },
            new () { 0.0, 0.0, 0.0, 0.0, 0.0, 1.0 },
            new () { 0.0, 0.0, 0.0, 0.0, 0.0, 1.0 },
            new () { 0.0, 0.0, 0.0, 0.0, 0.0, 1.0 },
            new () { 0.0, 1.0, 1.0, 1.0, 0.0, 0.0 },
            new () { 0.0, 0.0, 0.0, 0.0, 0.0, 0.0 },
        });
        var best = OgCandidateSelector.SelectBest(seq, cats, distFn);

        Assert.AreEqual(2, best.idx);
    }
}

[TestClass]
public class OgHeuristicTests
{
    [TestMethod]
    public void ShouldAdviceTotallyOrderedSequence()
    {
        // [(0 -> 1), (1 -> 2), (2 -> 3), (3 -> 4)]

        var source = new SolverPlace(5, 5);
        var target = new SolverPlace(6, 6);

        var places = new List<SolverPlace>
        {
            new (2, 2),
            new (1, 1),
            new (0, 0),
            new (4, 4),
            new (3, 3),
        };

        var distFn = new MatrixDistanceFunc(
            TestPrimitives.GenerateUnitDistanceMatrix(places.Count + 2));

        var arrows = new List<Arrow>
        {
            new (0, 1),
            new (1, 2),
            new (2, 3),
            new (3, 4),
        };

        var seq = OgHeuristic.Advise(places, distFn, arrows, source, target);

        var ans = new List<int> { 5, 0, 1, 2, 3, 4, 6 };

        Assert.AreEqual(ans.Count, seq.Count);

        for (int i = 0; i < ans.Count; ++i)
        {
            Assert.AreEqual(ans[i], seq[i].idx);
        }
    }

    [TestMethod]
    public void ShouldExitEarlyDueToEmptyCategory()
    {
        var places = new List<SolverPlace>
        {
            // new (0, 0),
            new (1, 1),
            new (2, 2),
        };

        var source = new SolverPlace(3, 3);
        var target = new SolverPlace(4, 4);

        var distFn = TestPrimitives.GenerateRandomDistanceMatrix(5);

        var arrows = new List<Arrow>
        {
            new (0, 2), // this arrow creates an empty free cat
            new (1, 2),
        };

        var seq = OgHeuristic.Advise(places, distFn, arrows, source, target);

        var ans = new List<int> { 3, 1, 4 };

        Assert.AreEqual(ans.Count, seq.Count);

        for (int i = 0; i < ans.Count; ++i)
        {
            Assert.AreEqual(ans[i], seq[i].idx);
        }
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
        var n = 100;

        var source = new SolverPlace(n, n);
        var target = new SolverPlace(n + 1, n + 1);

        var order = n + 2;

        var places = Enumerable
            .Range(0, n)
            .ToList()
            .DurstenfeldShuffle()
            .Select((idx) => new SolverPlace(idx, idx))
            .ToList();

        var distFn = TestPrimitives.GenerateRandomDistanceMatrix(order);
        var arrows = TestPrimitives.GenerateRandomArrows(order, probability);

        var result = OgHeuristic.Advise(places, distFn, arrows, source, target);

        // length

        Assert.AreEqual(order, result.Count);

        // terminals

        Assert.AreEqual(result[0].cat, n);
        Assert.AreEqual(result[^1].cat, n + 1);

        // arrows

        var closure = TestPrimitives.GetTransitiveClosure(order, arrows);

        for (int row = 0; row < result.Count - 1; ++row)
        {
            for (int col = row + 1; col < result.Count; ++col)
            {
                var fr = result[row].cat;
                var to = result[col].cat;

                Assert.IsFalse(closure[to][fr]);
            }
        }
    }
}
