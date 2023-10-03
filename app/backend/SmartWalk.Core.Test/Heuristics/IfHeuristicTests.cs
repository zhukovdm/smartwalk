using System.Collections.Generic;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using SmartWalk.Core.Algorithms;
using SmartWalk.Core.Extensions;
using SmartWalk.Core.Heuristics;
using SmartWalk.Model.Entities;

namespace SmartWalk.Core.Test;

[TestClass]
public class IfCategoryFormerTests
{
    private static readonly int N = 7;

    [TestMethod]
    public void ShouldSeparatePlacesByCategory()
    {
        var cats = IfCategoryFormer.Form(TestPrimitives.GetWaypoints(N), 0, N - 1);

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
    public void ShouldRemoveSourceAndTargetCategories()
    {
        var cats = IfCategoryFormer.Form(TestPrimitives.GetWaypoints(N), 1, N - 2);

        Assert.AreEqual(cats.Count, 5);

        foreach (var cat in cats)
        {
            Assert.AreNotEqual(cat.FirstOrDefault()?.cat, 1);
            Assert.AreNotEqual(cat.FirstOrDefault()?.cat, N - 2);
        }
    }

    [TestMethod]
    public void ShouldPrioritizeCategoriesWithLessItems()
    {
        var cats = IfCategoryFormer.Form(TestPrimitives.GetWaypoints(N), 0, N - 1);

        foreach (var (l, r) in cats.Zip(cats.Skip(1)))
        {
            Assert.IsTrue(l.Count < r.Count);
        }
        Assert.AreEqual(cats[0][0].cat, N - 2);
        Assert.AreEqual(cats[N - 3][0].cat, 1); // st are removed!
    }
}

[TestClass]
public class IfCandidateSelectorTests
{
    [TestMethod]
    public void ShouldSelectIndexAfterAllBefore()
    {
        // [(0 -> 2), (1 -> 2)]

        var seq = new List<SolverPlace>()
        {
            new(5, 5), // s
            new(0, 0),
            new(3, 3),
            new(1, 1),
            new(4, 4), // <-
            new(6, 6), // t
        };

        var cat = new List<SolverPlace>()
        {
            new(2, 2)
        };

        var distMatrix = new ListDistanceMatrix(TestPrimitives.GenerateUnitDistanceMatrix(7));

        var closure = TransitiveClosure.Closure(new()
        {
            new() { false, false, true,  false, false, false, true  },
            new() { false, false, true,  false, false, false, true  },
            new() { false, false, false, false, false, false, true  },
            new() { false, false, false, false, false, false, true  },
            new() { false, false, false, false, false, false, true  },
            new() { true,  true,  true,  true,  true,  false, true  },
            new() { false, false, false, false, false, false, false },
        });

        var precMatrix = new ListPrecedenceMatrix(closure, true);

        var (_, _, seqIdx) = IfCandidateSelector.SelectBest(seq, cat, distMatrix, precMatrix, 0.0);

        Assert.AreEqual(4, seqIdx);
    }

    [TestMethod]
    public void ShouldSelectIndexBeforeAllAfter()
    {
        // [(0 -> 1), (0 -> 2)]

        var seq = new List<SolverPlace>()
        {
            new(3, 3), // s
            new(1, 1), // <-
            new(2, 2),
            new(4, 4), // t
        };

        var cat = new List<SolverPlace>()
        {
            new(0, 0)
        };

        var distMatrix = new ListDistanceMatrix(TestPrimitives.GenerateUnitDistanceMatrix(5));

        var closure = TransitiveClosure.Closure(new()
        {
            new() { false, true,  true,  false, true  },
            new() { false, false, false, false, true  },
            new() { false, false, false, false, true  },
            new() { true,  true,  true,  false, true  },
            new() { false, false, false, false, false },
        });

        var precMatrix = new ListPrecedenceMatrix(closure, true);

        var (_, _, seqIdx) = IfCandidateSelector.SelectBest(seq, cat, distMatrix, precMatrix, 0.0);

        Assert.AreEqual(1, seqIdx);
    }

    [TestMethod]
    public void ShouldSelectCertainIndex()
    {
        // [(0 -> 1), (1 -> 2)]

        var seq = new List<SolverPlace>()
        {
            new(3, 3), // s
            new(0, 0),
            new(2, 2), // <-
            new(4, 4), // t
        };

        var cat = new List<SolverPlace>()
        {
            new(1, 1)
        };

        var distMatrix = new ListDistanceMatrix(TestPrimitives.GenerateUnitDistanceMatrix(5));

        var closure = TransitiveClosure.Closure(new()
        {
            new() { false, true,  false, false, true  },
            new() { false, false, true,  false, true  }, // <-
            new() { false, false, false, false, true  },
            new() { true,  true,  true,  false, true  },
            new() { false, false, false, false, false },
        });

        var precMatrix = new ListPrecedenceMatrix(closure, true);

        var (_, _, seqIdx) = IfCandidateSelector.SelectBest(seq, cat, distMatrix, precMatrix, 0.0);

        Assert.AreEqual(2, seqIdx);
    }

    [TestMethod]
    public void ShouldSelectCandidateWithTheSmallestImpactOnTheDistance()
    {
        // [(0 -> 1), (1 -> 2)]

        var seq = new List<SolverPlace>()
        {
            new(4, 3), // s
            new(0, 0),
            new(3, 2), // <-
            new(5, 4), // t
        };

        var cat = new List<SolverPlace>()
        {
            new(1, 1),
            new(2, 1),
        };

        var matrix = TestPrimitives.GenerateUnitDistanceMatrix(6);
        matrix[2][3] = 0.9;

        var distMatrix = new ListDistanceMatrix(matrix);

        var closure = TransitiveClosure.Closure(new()
        {
            new() { false, true,  false, false, true  },
            new() { false, false, true,  false, true  },
            new() { false, false, false, false, true  },
            new() { true,  true,  true,  false, true  },
            new() { false, false, false, false, false },
        });

        var precMatrix = new ListPrecedenceMatrix(closure, true);

        var (best, _, _) = IfCandidateSelector.SelectBest(seq, cat, distMatrix, precMatrix, 0.0);

        Assert.AreEqual(2, best.idx);
    }
}

[TestClass]
public class IfHeuristicTests
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

        var closure = TransitiveClosure.Closure(new()
        {
            new() { false, true,  false, false, false, false, true  },
            new() { false, false, true,  false, false, false, true  },
            new() { false, false, false, true,  false, false, true  },
            new() { false, false, false, false, true,  false, true  },
            new() { false, false, false, false, false, false, true  },
            new() { true,  true,  true,  true,  true,  false, true  },
            new() { false, false, false, false, false, false, false },
        });

        var precMatrix = new ListPrecedenceMatrix(closure, true);

        var seq = IfHeuristic.Advise(source, target, places, distMatrix, precMatrix);

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

        var result = IfHeuristic.Advise(source, target, places, distMatrix, precMatrix);

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
