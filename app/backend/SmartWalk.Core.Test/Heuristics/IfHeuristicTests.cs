using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using SmartWalk.Core.Algorithms;
using SmartWalk.Core.Extensions;
using SmartWalk.Core.Heuristics;
using SmartWalk.Model.Entities;
using SmartWalk.Model.Interfaces;

namespace SmartWalk.Core.Test;

[TestClass]
public class IfCategoryFormerTests
{
    private static readonly int N = 7;

    private List<SolverPlace> GetPlaces()
    {
        var places = new List<SolverPlace>();

        for (int idx = 0; idx < N; ++idx)
        {
            for (int cat = 0; cat < N - idx; ++cat)
            {
                places.Add(new(idx, cat));
            }
        }
        return places;
    }

    [TestMethod]
    public void ShouldSeparatePlacesByCategory()
    {
        var cats = IfCategoryFormer.Form(GetPlaces(), 0, N - 1);

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
        var cats = IfCategoryFormer.Form(GetPlaces(), 1, N - 2);

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
        var cats = IfCategoryFormer.Form(GetPlaces(), 0, N - 1);

        for (int i = 0; i < N - 3; ++i)
        {
            Assert.IsTrue(cats[i].Count < cats[i + 1].Count);
        }
        Assert.AreEqual(cats[0][0].cat, N - 2);
        Assert.AreEqual(cats[N - 3][0].cat, 1);
    }
}

[TestClass]
public class IfCandidateSelectorTests
{
    private static List<List<double>> GetUnitDistanceMatrix(int order)
    {
        var result = new List<List<double>>();

        for (int row = 0; row < order; ++row)
        {
            result.Add(new());

            for (int col = 0; col < order; ++col)
            {
                result[row].Add(row == col ? 0 : 1);
            }
        }
        return result;
    }

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

        var distMatrix = new ListDistanceMatrix(GetUnitDistanceMatrix(7));

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

        var distMatrix = new ListDistanceMatrix(GetUnitDistanceMatrix(5));

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

        var distMatrix = new ListDistanceMatrix(GetUnitDistanceMatrix(5));

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

        var matrix = GetUnitDistanceMatrix(6);
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
    private static List<List<double>> GetUnitDistanceMatrix(int order)
    {
        var result = new List<List<double>>();

        for (int row = 0; row < order; ++row)
        {
            result.Add(new());

            for (int col = 0; col < order; ++col)
            {
                result[row].Add(row == col ? 0 : 1);
            }
        }
        return result;
    }

    private static IDistanceMatrix GetDistanceMatrix(int order)
    {
        var N = order + 2;
        var rand = new Random();

        var matrix = Enumerable.Range(0, N).Select((_) => Enumerable.Repeat(0.0, N).ToList()).ToList();

        for (int row = 0; row < N; ++row)
        {
            for (int col = 0; col < N; ++col)
            {
                if (row != col)
                {
                    matrix[row][col] = rand.NextDouble();
                }
            }
        }
        return new ListDistanceMatrix(matrix);
    }

    private static IPrecedenceMatrix GetPrecedenceMatrix(int order)
    {
        var N = order + 2;
        var rand = new Random();

        var topo = Enumerable.Range(0, N).ToList().DurstenfeldShuffle();
        var matrix = Enumerable.Range(0, N).Select((_) => Enumerable.Repeat(false, N).ToList()).ToList();

        for (int row = 0; row < order - 1; ++row)
        {
            for (int col = 0; col < order; ++col)
            {
                if (rand.NextDouble() < 0.5)
                {
                    matrix[row][col] = true;
                }
            }
        }

        // st-edges

        for (int row = 0; row < N - 1; ++row)
        {
            matrix[row][N - 1] = true;
        }

        for (int col = 0; col < N; ++col)
        {
            var row = N - 2;

            if (row != col)
            {
                matrix[row][col] = true;
            }
        }
        return new ListPrecedenceMatrix(TransitiveClosure.Closure(matrix), true);
    }

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
        var distMatrix = new ListDistanceMatrix(GetUnitDistanceMatrix(7));

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
    public void ShouldAdviceValidSequenceForRandomGraph()
    {
        var N = 10;

        var places = Enumerable
            .Range(0, N).ToList()
            .DurstenfeldShuffle()
            .Select((idx, cat) => new SolverPlace(idx, cat)).ToList();

        var distMatrix = GetDistanceMatrix(N);
        var precMatrix = GetPrecedenceMatrix(N);

        var result = IfHeuristic.Advise(new(10, 10), new(11, 11), places, distMatrix, precMatrix);

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
