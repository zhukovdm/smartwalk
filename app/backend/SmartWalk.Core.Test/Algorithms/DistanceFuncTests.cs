using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using SmartWalk.Core.Algorithms;
using SmartWalk.Core.Entities;

namespace SmartWalk.Core.Test;

[TestClass]
public class MatrixDistanceFuncTests
{
    private static List<List<double>> GetMatrix()
    {
        return new ()
        {
            new () { 0.0, 1.0, 2.0 },
            new () { 1.0, 0.0, 1.0 },
            new () { 2.0, 1.0, 0.0 }
        };
    }

    [TestMethod]
    public void ShouldReturnExpectedDistance()
    {
        var m = new MatrixDistanceFunc(GetMatrix());
        Assert.AreEqual(m.GetDistance(0, 2), 2.0);
    }

    [TestMethod]
    [ExpectedException(typeof(ArgumentOutOfRangeException))]
    public void ShouldThrowUponOutOfRangeQuery()
    {
        _ = new MatrixDistanceFunc(GetMatrix()).GetDistance(3, 3);
    }
}

[TestClass]
public class HaversineDistanceFuncTests
{
    private static Place GetPlace(string handle, double lon, double lat)
    {
        return new ()
        {
            smartId = handle,
            name = "Place",
            location = new (lon, lat),
            keywords = new ()
        };
    }

    private static List<Place> GetPlaces(List<string> handles)
    {
        return handles
            .Select((handle, i) => GetPlace(handle, i, i))
            .ToList();
    }

    [TestMethod]
    public void ShouldCalculateDistance()
    {
        var m = new HaversineDistanceFunc(GetPlaces(new () { "A", "B" }));
        Assert.AreNotEqual(m.GetDistance(0, 1), 0.0);
    }

    [TestMethod]
    public void ShouldScaleDistances()
    {
        var m1 = new HaversineDistanceFunc(GetPlaces(new () { "A", "B" }), 1.0);
        var m2 = new HaversineDistanceFunc(GetPlaces(new () { "A", "B" }), 2.0);
        Assert.IsTrue(Math.Abs((m1.GetDistance(0, 1) * 2.0) - m2.GetDistance(0, 1)) < 0.000001);
    }

    [TestMethod]
    [ExpectedException(typeof(ArgumentOutOfRangeException))]
    public void ShouldThrowUponOutOfRangeQuery()
    {
        new HaversineDistanceFunc(GetPlaces(new () { "A", "B", "C" })).GetDistance(3, 3);
    }
}
