using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using SmartWalk.Core.Entities;
using SmartWalk.Infrastructure.RoutingEngine.Osrm;
using SmartWalk.Infrastructure.Test.Fakes;

namespace SmartWalk.Infrastructure.Test;

[TestClass]
public class OsrmShortestPathQueryExecutorTests
{
    private static readonly List<OsrmRoute> _routes = new()
    {
        new() { distance = 3.0, duration = 3.0, geometry = new(new [] { new[] { 0.0, 0.0 }, new[] { 0.0, 0.0 } }) },
        new() { distance = 2.0, duration = 2.0, geometry = new(new [] { new[] { 0.0, 0.0 }, new[] { 0.0, 0.0 } }) },
        new() { distance = 1.0, duration = 1.0, geometry = new(new [] { new[] { 0.0, 0.0 }, new[] { 0.0, 0.0 } }) },
    };

    [TestMethod]
    public async Task ShouldReturnEmptyList()
    {
        var paths = await OsrmShortestPathQueryExecutor.Execute(new FakeOsrmRouteFetcher(new()), new List<WgsPoint>());
        Assert.AreEqual(0, paths.Count);
    }

    [TestMethod]
    public async Task ShouldReturnListOfTheSameLength()
    {
        var fetch = new FakeOsrmRouteFetcher(_routes);
        var paths = await OsrmShortestPathQueryExecutor.Execute(fetch, new List<WgsPoint>());

        Assert.AreEqual(_routes.Count, paths.Count);
    }

    [TestMethod]
    public async Task ShouldReturnSortedList()
    {
        var fetch = new FakeOsrmRouteFetcher(_routes);
        var paths = await OsrmShortestPathQueryExecutor.Execute(fetch, new List<WgsPoint>());

        var expected = new List<double>() { 1.0, 2.0, 3.0 };

        for (int i = 0; i < paths.Count; ++i)
        {
            Assert.AreEqual(expected[i], paths[i].distance);
        }
    }
}
