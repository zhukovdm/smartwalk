using System.Collections.Generic;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace SmartWalk.Core.Test;

[TestClass]
public class ListPrecedenceMatrixTests
{
    [TestMethod]
    public void ShouldAnswerEmptyIfNoNonTerminalEdges()
    {
        var lists = new List<List<bool>>()
        {
            new() { true, true },
            new() { true, true },
        };
        Assert.IsFalse(new ListPrecedenceMatrix(new(), false).HasNonTerminalEdges);
    }
}
