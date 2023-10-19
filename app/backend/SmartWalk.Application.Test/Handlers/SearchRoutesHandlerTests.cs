using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using SmartWalk.Application.Handlers;
using SmartWalk.Core.Entities;

namespace SmartWalk.Application.Test;

[TestClass]
public class SearchRoutesHandlerTests
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

        var routes = await new SearchRoutesHandler(entityIndex, routingEngine).Handle(new()
        {
            source = new(0.0, 0.0), target = new(1.0, 1.0), maxDistance = 1e9, categories = _categories, arrows = _arrows
        });

        Assert.AreEqual(N, routes.Count);
    }

    [TestMethod]
    public async Task ShouldPreserveArrowConfiguration()
    {
        var N = 10;

        var entityIndex = new FakeEntityIndex(N, _categories.Select((cat) => cat.keyword).ToList());
        var routingEngine = new FakeFastRoutingEngine();

        var routes = await new SearchRoutesHandler(entityIndex, routingEngine).Handle(new()
        {
            source = new(0.0, 0.0), target = new(1.0, 1.0), maxDistance = 1e9, categories = _categories, arrows = _arrows
        });

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

        var routes = await new SearchRoutesHandler(entityIndex, routingEngine).Handle(new()
        {
            source = new(0.0, 0.0), target = new(1.0, 1.0), maxDistance = 0, categories = _categories, arrows = _arrows
        });

        Assert.AreEqual(0, routes.Count);
    }

    [TestMethod]
    public async Task ShouldMergeCategoriesOfPlacesWithTheSameId()
    {
        var N = 1;

        var entityIndex = new FakeEntityIndex(N, _categories.Select((cat) => cat.keyword).ToList());
        var routingEngine = new FakeFastRoutingEngine();

        var routes = await new SearchRoutesHandler(entityIndex, routingEngine).Handle(new()
        {
            source = new(0.0, 0.0), target = new(1.0, 1.0), maxDistance = 1e9, categories = _categories, arrows = _arrows
        });

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

        var routes = await new SearchRoutesHandler(entityIndex, routingEngine).Handle(new()
        {
            source = new(0.0, 0.0), target = new(1.0, 1.0), maxDistance = 1e9, categories = _categories, arrows = _arrows
        });

        Assert.AreEqual(1, routes.Count);
    }
}
