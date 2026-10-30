using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using SmartWalk.Core.Algorithms;
using SmartWalk.Core.Entities;

namespace SmartWalk.Core.Test.Algorithms;

[TestClass]
public class MatrixDistanceFuncTests
{
    private static List<List<double>> GetMatrix() =>
    [
        [0.0, 1.0, 2.0],
        [1.0, 0.0, 1.0],
        [2.0, 1.0, 0.0]
    ];

    [TestMethod]
    public void ShouldReturnExpectedDistance()
    {
        var m = new MatrixDistanceFunc(GetMatrix());
        Assert.AreEqual(2.0, m.GetDistance(0, 2));
    }

    [TestMethod]
    public void ShouldThrowUponOutOfRangeQuery()
    {
        Assert.ThrowsExactly<ArgumentOutOfRangeException>(() => _ = new MatrixDistanceFunc(GetMatrix()).GetDistance(3, 3));
    }
}

[TestClass]
public class HaversineDistanceFuncTests
{
    private static Place GetPlace(string handle, double lon, double lat)
    {
        return new()
        {
            smartId = handle,
            name = "Place",
            location = new(lon, lat),
            keywords = []
        };
    }

    private static List<Place> GetPlaces(List<string> handles)
    {
        return [.. handles.Select((handle, i) => GetPlace(handle, i, i))];
    }

    [TestMethod]
    public void ShouldCalculateDistance()
    {
        var m = new HaversineDistanceFunc(GetPlaces(["A", "B"]));
        Assert.AreNotEqual(0.0, m.GetDistance(0, 1));
    }

    [TestMethod]
    public void ShouldScaleDistances()
    {
        var m1 = new HaversineDistanceFunc(GetPlaces(["A", "B"]), 1.0);
        var m2 = new HaversineDistanceFunc(GetPlaces(["A", "B"]), 2.0);
        Assert.IsLessThan(0.000001, Math.Abs((m1.GetDistance(0, 1) * 2.0) - m2.GetDistance(0, 1)));
    }

    [TestMethod]
    public void ShouldThrowUponOutOfRangeQuery()
    {
        Assert.ThrowsExactly<ArgumentOutOfRangeException>(() => new HaversineDistanceFunc(GetPlaces(["A", "B", "C"])).GetDistance(3, 3));
    }
}
