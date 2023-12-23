using System.Collections.Generic;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using SmartWalk.Application.Parsers;
using SmartWalk.Core.Entities;

namespace SmartWalk.Application.Test;

[TestClass]
public class ArrowValidationTests
{
    [TestMethod]
    public void ShouldDetectOutOfBoundFrEdge()
    {
        var arrows = new List<Arrow>
        {
            new(0, 1),
            new(1, 2),
            new(3, 2), // !
            new(0, 2)
        };

        var valid = SearchRoutesQueryParser.ValidateArrows(arrows, 3, out var _);

        Assert.IsFalse(valid);
    }

    [TestMethod]
    public void ShouldDetectOutOfBoundToEdge()
    {
        var arrows = new List<Arrow>
        {
            new(0, 1),
            new(1, 2),
            new(2, 3), // !
            new(0, 2)
        };

        var valid = SearchRoutesQueryParser.ValidateArrows(arrows, 3, out var _);

        Assert.IsFalse(valid);
    }

    [TestMethod]
    public void ShouldDetectLoop()
    {
        var arrows = new List<Arrow>
        {
            new(0, 1),
            new(1, 2),
            new(2, 2), // !
            new(0, 2),
        };

        var valid = SearchRoutesQueryParser.ValidateArrows(arrows, 3, out var _);

        Assert.IsFalse(valid);
    }

    [TestMethod]
    public void ShouldDetectRepeatedEdge()
    {
        var arrows = new List<Arrow>
        {
            new(0, 1),
            new(1, 2), // !
            new(2, 3),
            new(3, 4),
            new(1, 2), // !
            new(0, 2),
        };

        var valid = SearchRoutesQueryParser.ValidateArrows(arrows, 5, out var _);

        Assert.IsFalse(valid);
    }

    [TestMethod]
    public void ShouldDetectCycle()
    {
        var arrows = new List<Arrow>
        {
            new(0, 1),
            new(1, 2), // !
            new(2, 3), // !
            new(3, 4),
            new(3, 5), // !
            new(5, 6), // !
            new(6, 1), // !
        };

        var valid = SearchRoutesQueryParser.ValidateArrows(arrows, 7, out var _);

        Assert.IsFalse(valid);
    }

    [TestMethod]
    public void WellFormed()
    {
        var N = 100;
        var arrows = new List<Arrow>();

        for (int fr = N - 1; fr >= 0; --fr)
        {
            for (int to = fr + 1; to <= N - 1; ++to)
            {
                arrows.Add(new(fr, to));
            }
        }

        var valid = SearchRoutesQueryParser.ValidateArrows(arrows, N, out var _);

        Assert.IsTrue(valid);
    }
}

[TestClass]
public class DistanceValidationTests
{
    [TestMethod]
    public void ShouldDetectLongDistance()
    {
        var source = new WgsPoint(0.0, 0.0);
        var target = new WgsPoint(1.0, 1.0);

        var valid = SearchRoutesQueryParser.ValidateRouteMaxDistance(source, target, 30000.0);

        Assert.IsFalse(valid);
    }

    [TestMethod]
    public void DistanceWithinBounds()
    {
        var source = new WgsPoint(0.0, 0.0);
        var target = new WgsPoint(0.0, 0.0);

        var valid = SearchRoutesQueryParser.ValidateRouteMaxDistance(source, target, 30000.0);

        Assert.IsTrue(valid);
    }
}
