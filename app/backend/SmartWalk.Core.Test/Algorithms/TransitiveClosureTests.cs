using System.Collections.Generic;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace SmartWalk.Core.Test;

[TestClass]
public class TransitiveClosureTests
{
    [TestMethod]
    public void ShouldProduceAllOnesMatrix()
    {
        var m = new List<List<bool>>()
        {
            new() { false, true, false, false, false },
            new() { false, false, true, false, false },
            new() { false, false, false, true, false },
            new() { false, false, false, false, true },
            new() { true, false, false, false, false }
        };
        var c = TransitiveClosure.Closure(m);

        for (int row = 0; row < m.Count; ++row)
        {
            for (int col = 0; col < m.Count; ++col)
            {
                Assert.IsTrue(c[row][col]);
            }
        }
    }

    [TestMethod]
    public void ShouldProduceIdentityMatrix()
    {
        var m = new List<List<bool>>()
        {
            new() { true, false, false, false, false },
            new() { false, true, false, false, false },
            new() { false, false, true, false, false },
            new() { false, false, false, true, false },
            new() { false, false, false, false, true }
        };
        var c = TransitiveClosure.Closure(m);

        for (int row = 0; row < m.Count; ++row)
        {
            for (int col = 0; col < m.Count; ++col)
            {
                Assert.IsTrue(row == col ? c[row][col] : !c[row][col]);
            }
        }
    }

    [TestMethod]
    public void ShouldProduceTriangularMatrix()
    {
        var m = new List<List<bool>>()
        {
            new() { false, true, false, false, false },
            new() { false, false, true, false, false },
            new() { false, false, false, true, false },
            new() { false, false, false, false, true },
            new() { false, false, false, false, false }
        };
        var c = TransitiveClosure.Closure(m);

        for (int row = 0; row < m.Count; ++row)
        {
            for (int col = 0; col < m.Count; ++col)
            {
                Assert.IsTrue(row < col ? c[row][col] : !c[row][col]);
            }
        }
    }
}
