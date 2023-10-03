using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using SmartWalk.Model.Entities;
using SmartWalk.Service.Test.Fakes;

namespace SmartWalk.Service.Test;

[TestClass]
public class SearchServiceTests
{
    private static readonly List<Category> _categories = new()
    {
        new() { keyword = "a", filters = new() },
        new() { keyword = "b", filters = new() },
        new() { keyword = "c", filters = new() },
        new() { keyword = "d", filters = new() },
    };

    private static readonly List<PrecedenceEdge> _arrows = new()
    {
        new(0, 1), // (a -> b)
        new(2, 3), // (c -> d)
    };

    [TestMethod]
    public async Task ShouldFindNRoutes()
    {
        var N = 10;

        var entityIndex = new FakeEntityIndex(N, _categories.Select((cat) => cat.keyword).ToList());
        var routingEngine = new FakeFastRoutingEngine();

        var routes = await SearchService
            .GetRoutes(entityIndex, routingEngine, new(0.0, 0.0), new(1.0, 1.0), 1e9, _categories, _arrows);

        Assert.AreEqual(N, routes.Count);
    }

    [TestMethod]
    public async Task ShouldPreserveArrowConfiguration()
    {
        var N = 10;

        var entityIndex = new FakeEntityIndex(N, _categories.Select((cat) => cat.keyword).ToList());
        var routingEngine = new FakeFastRoutingEngine();

        var routes = await SearchService
            .GetRoutes(entityIndex, routingEngine, new(0.0, 0.0), new(1.0, 1.0), 1e9, _categories, _arrows);

        foreach (var route in routes)
        {
            foreach (var arrow in _arrows)
            {
                var frIdx = route.places.FindIndex((Place place) => place.categories.Contains(arrow.fr));
                var toIdx = route.places.FindIndex((Place place) => place.categories.Contains(arrow.to));
                Assert.IsTrue(frIdx <= toIdx);
            }
        }
    }

    [TestMethod]
    public async Task ShouldSkipPathsLongerThanAllowedMaxDistance()
    {
        var N = 10;

        var entityIndex = new FakeEntityIndex(N, _categories.Select((cat) => cat.keyword).ToList());
        var routingEngine = new FakeDistanceRoutingEngine(1e9);

        var routes = await SearchService
            .GetRoutes(entityIndex, routingEngine, new(0.0, 0.0), new(1.0, 1.0), 0, _categories, _arrows);

        Assert.AreEqual(0, routes.Count);
    }

    [TestMethod]
    public async Task ShouldMergeCategoriesOfPlacesWithTheSameId()
    {
        var N = 1;

        var entityIndex = new FakeEntityIndex(N, _categories.Select((cat) => cat.keyword).ToList());
        var routingEngine = new FakeFastRoutingEngine();

        var routes = await SearchService
            .GetRoutes(entityIndex, routingEngine, new(0.0, 0.0), new(1.0, 1.0), 1e9, _categories, _arrows);

        Assert.AreEqual(1, routes.Count);
        Assert.AreEqual(1, routes.First().places.Count);

        foreach (var cat in new[] { 0, 1, 2, 3 })
        {
            routes[0].places[0].categories.Contains(cat);
        }
    }

    [TestMethod]
    public async Task ShouldFindOneRouteAndExitAfterTimerIsExpired()
    {
        var N = 10;

        var entityIndex = new FakeEntityIndex(N, _categories.Select((cat) => cat.keyword).ToList());
        var routingEngine = new FakeSlowRoutingEngine();

        var routes = await SearchService
            .GetRoutes(entityIndex, routingEngine, new(0.0, 0.0), new(1.0, 1.0), 1e9, _categories, _arrows);

        Assert.AreEqual(1, routes.Count);
    }
}
