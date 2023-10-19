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
    private static readonly int N = 4;

    [TestMethod]
    public void ShouldSeparatePlacesByCategoryAndRemoveSourceTarget()
    {
        // [(0 -> 2), (1 -> 2), (2 -> 3)]

        var places = TestPrimitives.GetWaypoints(N);
        places.Add(new(4, 4));
        places.Add(new(5, 5));

        var precMatrix = new ListPrecedenceMatrix(new()
        {
            new() { false, false, true,  false, false, true  },
            new() { false, false, true,  false, false, true  },
            new() { false, false, false, true,  false, true  },
            new() { false, false, false, false, false, true  },
            new() { true,  true,  true,  true,  false, true  },
            new() { false, false, false, false, false, false },
        }, true);

        var cats = OgCategoryFormer.Form(places, precMatrix, 4, 5);

        // places

        foreach (var cat in cats)
        {
            var obj = cat.Value;
            Assert.AreEqual(obj.places.Count, N - cat.Key);
        }

        // st

        Assert.IsFalse(cats.ContainsKey(4));
        Assert.IsFalse(cats.ContainsKey(5));

        // predecessors

        Assert.AreEqual(0, cats[0].pred);
        Assert.AreEqual(0, cats[1].pred);
        Assert.AreEqual(2, cats[2].pred);
        Assert.AreEqual(1, cats[3].pred);

        // successors

        Assert.AreEqual(1, cats[0].succ.Count);
        Assert.AreEqual(1, cats[1].succ.Count);
        Assert.AreEqual(1, cats[2].succ.Count);
        Assert.AreEqual(0, cats[3].succ.Count);
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
            new(4, 4), // s
            new(0, 0),
            new(5, 5), // t
        };

        var p1 = new OgCategory();
        p1.places.Add(new(1, 1));

        var p2 = new OgCategory();
        p2.places.Add(new(2, 2));

        var p3 = new OgCategory();
        p3.places.Add(new(3, 3));

        var cats = new List<OgCategory> { p1, p2, p3 };

        var distMatrix = new ListDistanceMatrix(new()
        {
            new() { 0.0, 2.0, 1.0, 3.0, 0.0, 0.0 },
            new() { 0.0, 0.0, 0.0, 0.0, 0.0, 1.0 },
            new() { 0.0, 0.0, 0.0, 0.0, 0.0, 1.0 },
            new() { 0.0, 0.0, 0.0, 0.0, 0.0, 1.0 },
            new() { 0.0, 1.0, 1.0, 1.0, 0.0, 0.0 },
            new() { 0.0, 0.0, 0.0, 0.0, 0.0, 0.0 },
        });
        var best = OgCandidateSelector.SelectBest(seq, cats, distMatrix);

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
            new(2, 2),
            new(1, 1),
            new(0, 0),
            new(4, 4),
            new(3, 3),
        };
        var distMatrix = new ListDistanceMatrix(TestPrimitives.GenerateUnitDistanceMatrix(7));

        var precMatrix = new ListPrecedenceMatrix(new()
        {
            new() { false, true,  false, false, false, false, true  },
            new() { false, false, true,  false, false, false, true  },
            new() { false, false, false, true,  false, false, true  },
            new() { false, false, false, false, true,  false, true  },
            new() { false, false, false, false, false, false, true  },
            new() { true,  true,  true,  true,  true,  false, true  },
            new() { false, false, false, false, false, false, false },
        }, true);

        var seq = OgHeuristic.Advise(source, target, places, distMatrix, precMatrix);

        var ans = new List<int> { 5, 0, 1, 2, 3, 4, 6 };

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
        var N = 100;

        var source = new SolverPlace(N, N);
        var target = new SolverPlace(N + 1, N + 1);

        var order = N + 2;

        var places = Enumerable
            .Range(0, N)
            .ToList()
            .DurstenfeldShuffle()
            .Select((idx) => new SolverPlace(idx, idx))
            .Concat(new[] { source, target })
            .ToList();

        var distMatrix = TestPrimitives.GenerateRandomDistanceMatrix(order);
        var precMatrix = TestPrimitives.GenerateRandomPrecedenceMatrix(order, probability);

        var result = OgHeuristic.Advise(source, target, places, distMatrix, precMatrix);

        // length

        Assert.AreEqual(order, result.Count);

        // terminals

        Assert.AreEqual(result[ 0].cat, N);
        Assert.AreEqual(result[^1].cat, N + 1);

        // arrows

        for (int row = 0; row < result.Count - 1; ++row)
        {
            for (int col = row + 1; col < result.Count; ++col)
            {
                var fr = result[row].cat;
                var to = result[col].cat;

                Assert.IsFalse(precMatrix.IsBefore(to, fr));
            }
        }
    }
}
