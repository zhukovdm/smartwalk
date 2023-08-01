using System.Collections.Generic;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using SmartWalk.Core.Algorithms;

namespace SmartWalk.Core.Tests;

[TestClass]
public class CycleDetectorTests
{
    [TestMethod]
    public void SingleVertex()
    {
        Assert.IsNull(new CycleDetector(1).Cycle());
    }

    [TestMethod]
    public void TwoVertexDirectedCycle()
    {
        var c = new CycleDetector(2)
            .AddEdge(0, 1)
            .AddEdge(1, 0)
            .Cycle();
        Assert.IsTrue(c.SequenceEqual(new List<int>{ 0, 1, 0 }));
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
    public void AcyclicGraph()
    {
        var c = new CycleDetector(7)
            .AddEdge(6, 0)
            .AddEdge(2, 0)
            .AddEdge(5, 6)
            .AddEdge(4, 6)
            .AddEdge(3, 2)
            .AddEdge(1, 2)
            .Cycle();
        Assert.IsNull(c);
    }
}
