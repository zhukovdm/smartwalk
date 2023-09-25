using System.Collections.Generic;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using SmartWalk.Core.Algorithms;

namespace SmartWalk.Core.Test;

[TestClass]
public class CycleDetectorTests
{
    [TestMethod]
    public void SingleVertexWithNoEdges()
    {
        Assert.IsNull(new CycleDetector(1).Cycle());
    }

    [TestMethod]
    public void SingleVertexWithLoop()
    {
        var c = new CycleDetector(1)
            .AddEdge(0, 0)
            .Cycle();
        Assert.IsTrue(c.SequenceEqual(new List<int> { 0, 0 }));
    }

    [TestMethod]
    public void TwoVertexDirectedCycle()
    {
        var c = new CycleDetector(2)
            .AddEdge(0, 1)
            .AddEdge(1, 0)
            .Cycle();
        Assert.IsTrue(c.SequenceEqual(new List<int> { 0, 1, 0 }));
    }

    [TestMethod]
    public void ThreeIsolatedVertices()
    {
        Assert.IsNull(new CycleDetector(3).Cycle());
    }

    [TestMethod]
    public void ThreeVertexDirectedCycle()
    {
        var c = new CycleDetector(3)
            .AddEdge(0, 1)
            .AddEdge(1, 2)
            .AddEdge(2, 0)
            .Cycle();
        Assert.IsTrue(c.SequenceEqual(new List<int>() { 0, 1, 2, 0 }));
    }

    [TestMethod]
    public void CyclicGraphConstructCycle()
    {
        var c = new CycleDetector(7)
            .AddEdge(0, 1)
            .AddEdge(0, 4)
            .AddEdge(0, 2)
            .AddEdge(2, 5)
            .AddEdge(4, 3)
            .AddEdge(5, 6)
            .AddEdge(6, 0)
            .Cycle();
        Assert.IsTrue(c.SequenceEqual(new List<int>() { 0, 2, 5, 6, 0 }));
    }

    [TestMethod]
    public void LargeDirectedAcyclicGraph()
    {
        var N = 100;

        var g = new CycleDetector(N);

        for (int fr = N - 1; fr > 0; --fr)
        {
            for (int to = fr - 1; to >= 0; --to)
            {
                g.AddEdge(fr, to);
            }
        }
        Assert.IsNull(g.Cycle());
    }
}
