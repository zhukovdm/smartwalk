using System.Collections.Generic;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using SmartWalk.Core.Algorithms;

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
        Assert.IsFalse(new ListPrecedenceMatrix(new(), false).HasArrows);
    }
}
