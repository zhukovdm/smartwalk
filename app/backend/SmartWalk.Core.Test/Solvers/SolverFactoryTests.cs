using System.Collections.Generic;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using SmartWalk.Core.Entities;
using SmartWalk.Core.Solvers;

namespace SmartWalk.Core.Test;

[TestClass]
public class SolverFactoryTests
{
    [TestMethod]
    public void ShouldReturnFloatSolver()
    {
        var distFn = TestPrimitives.GenerateRandomDistanceMatrix(10);
        var arrows = new List<Arrow>();

        var solver = new SolverFactory(distFn, arrows, new (0, 0), new (1, 1)).GetSolver();

        Assert.IsNotNull(solver as SolverFactory.FloatSolver);
    }

    [TestMethod]
    public void ShouldReturnArrowSolver()
    {
        var distFn = TestPrimitives.GenerateRandomDistanceMatrix(10);
        var arrows = new List<Arrow>
        {
            new (0, 1)
        };

        var solver = new SolverFactory(distFn, arrows, new (0, 0), new (1, 1)).GetSolver();

        Assert.IsNotNull(solver as SolverFactory.ArrowSolver);
    }
}
