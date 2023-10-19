using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using SmartWalk.Api.Controllers;
using SmartWalk.Application.Entities;

namespace SmartWalk.Api.Test;

[TestClass]
public class SearchControllerSearchDirecsTests
{
    private static readonly string VALID_DIRECS_QUERY = @"{
        ""waypoints"": [
            {
                ""lon"": 0.0,
                ""lat"": 0.0
            },
            {
                ""lon"": 0.0,
                ""lat"": 0.0
            }
        ]
    }";

    [TestMethod]
    public async Task ShouldReturnBadRequestDueToInvalidQueryString()
    {
        var context = new SearchContext()
        {
            RoutingEngine = new FakeWorkingRoutingEngine()
        };
        var controller = new SearchController(context, new FakeLogger<SearchController>());

        var query = "{}";
        var value = ((await controller.SearchDirecs(new() { query = query })).Result as ObjectResult).Value;
        var hasError = (value as ValidationProblemDetails).Errors.ContainsKey("query");

        Assert.IsTrue(hasError);
    }

    [TestMethod]
    public async Task ShouldReturnServerErrorDueToFailingRoutingEngine()
    {
        var context = new SearchContext()
        {
            RoutingEngine = new FakeFailingRoutingEngine()
        };
        var controller = new SearchController(context, new FakeLogger<SearchController>());

        var result = (await controller.SearchDirecs(new() { query = VALID_DIRECS_QUERY })).Result as StatusCodeResult;

        Assert.AreEqual(StatusCodes.Status500InternalServerError, result.StatusCode);
    }

    [TestMethod]
    public async Task ShouldReturnListOfDirections()
    {
        var context = new SearchContext()
        {
            RoutingEngine = new FakeWorkingRoutingEngine()
        };
        var controller = new SearchController(context, new FakeLogger<SearchController>());

        var value = (await controller.SearchDirecs(new() { query = VALID_DIRECS_QUERY })).Value;

        Assert.IsTrue(value is not null);
    }
}

[TestClass]
public class SearchControllerSearchPlacesTests
{
    private static readonly string VALID_PLACES_QUERY = @"{
        ""center"": {
            ""lon"": 0.0,
            ""lat"": 0.0
        },
        ""radius"": 1000.0,
        ""categories"": [
            {
                ""keyword"": ""a"",
                ""filters"": {}
            },
            {
                ""keyword"": ""b"",
                ""filters"": {}
            },
            {
                ""keyword"": ""c"",
                ""filters"": {}
            }
        ]
    }";

    [TestMethod]
    public async Task ShouldReturnBadRequestDueToInvalidQueryString()
    {
        var context = new SearchContext()
        {
            EntityIndex = new FakeWorkingEntityIndex()
        };
        var controller = new SearchController(context, new FakeLogger<SearchController>());

        var value = ((await controller.SearchPlaces(new() { query = "{}" })).Result as ObjectResult).Value;
        var hasError = (value as ValidationProblemDetails).Errors.ContainsKey("query");

        Assert.IsTrue(hasError);
    }

    [TestMethod]
    public async Task ShouldReturnServerErrorDueToFailingEntityIndex()
    {
        var context = new SearchContext()
        {
            EntityIndex = new FakeFailingEntityIndex()
        };
        var controller = new SearchController(context, new FakeLogger<SearchController>());

        var result = (await controller.SearchPlaces(new() { query = VALID_PLACES_QUERY })).Result as StatusCodeResult;

        Assert.AreEqual(StatusCodes.Status500InternalServerError, result.StatusCode);
    }

    [TestMethod]
    public async Task ShouldReturnListOfPlaces()
    {
        var context = new SearchContext()
        {
            EntityIndex = new FakeWorkingEntityIndex()
        };
        var controller = new SearchController(context, new FakeLogger<SearchController>());

        var value = (await controller.SearchPlaces(new() { query = VALID_PLACES_QUERY })).Value;

        Assert.IsTrue(value is not null);
    }
}

[TestClass]
public class SearchControllerSearchRoutesTests
{
    private static readonly string VALID_ROUTES_QUERY = @"{
        ""source"": {
            ""lon"": 0.0,
            ""lat"": 0.0
        },
        ""target"": {
            ""lon"": 0.0,
            ""lat"": 0.0
        },
        ""maxDistance"": 5000.0,
        ""categories"": [
            {
                ""keyword"": ""a"",
                ""filters"": {}
            },
            {
                ""keyword"": ""b"",
                ""filters"": {}
            },
            {
                ""keyword"": ""c"",
                ""filters"": {}
            }
        ],
        ""arrows"": [
            {
                ""fr"": 0,
                ""to"": 1
            },
            {
                ""fr"": 1,
                ""to"": 2
            }
        ]
    }";

    [TestMethod]
    public async Task ShouldReturnBadRequestDueToInvalidQueryString()
    {
        var context = new SearchContext()
        {
            EntityIndex = new FakeWorkingEntityIndex(),
            RoutingEngine = new FakeWorkingRoutingEngine()
        };
        var controller = new SearchController(context, new FakeLogger<SearchController>());

        var query = "{}";
        var value = ((await controller.SearchRoutes(new() { query = query })).Result as ObjectResult).Value;
        var hasError = (value as ValidationProblemDetails).Errors.ContainsKey("query");

        Assert.IsTrue(hasError);
    }

    [TestMethod]
    public async Task ShouldReturnBadRequestDueToInvalidArrowConfiguration()
    {
        var context = new SearchContext()
        {
            EntityIndex = new FakeWorkingEntityIndex(),
            RoutingEngine = new FakeWorkingRoutingEngine()
        };
        var controller = new SearchController(context, new FakeLogger<SearchController>());

        var query = @"{
            ""source"": {
                ""lon"": 0.0,
                ""lat"": 0.0
            },
            ""target"": {
                ""lon"": 0.0,
                ""lat"": 0.0
            },
            ""maxDistance"": 5000.0,
            ""categories"": [
                {
                    ""keyword"": ""a"",
                    ""filters"": {}
                },
                {
                    ""keyword"": ""b"",
                    ""filters"": {}
                },
                {
                    ""keyword"": ""c"",
                    ""filters"": {}
                }
            ],
            ""arrows"": [
                {
                    ""fr"": 0,
                    ""to"": 1
                },
                {
                    ""fr"": 1,
                    ""to"": 0
                }
            ]
        }";

        var value = ((await controller.SearchRoutes(new() { query = query })).Result as ObjectResult).Value;
        var hasError = (value as ValidationProblemDetails).Errors.ContainsKey("query");

        Assert.IsTrue(hasError);
    }

    [TestMethod]
    public async Task ShouldReturnBadRequestDueToTooLargeDistance()
    {
        var context = new SearchContext()
        {
            EntityIndex = new FakeWorkingEntityIndex(),
            RoutingEngine = new FakeWorkingRoutingEngine()
        };
        var controller = new SearchController(context, new FakeLogger<SearchController>());

        var query = @"{
            ""source"": {
                ""lon"": 0.0,
                ""lat"": 0.0
            },
            ""target"": {
                ""lon"": 1.0,
                ""lat"": 1.0
            },
            ""maxDistance"": 5000.0,
            ""categories"": [
                {
                    ""keyword"": ""a"",
                    ""filters"": {}
                },
                {
                    ""keyword"": ""b"",
                    ""filters"": {}
                },
                {
                    ""keyword"": ""c"",
                    ""filters"": {}
                }
            ],
            ""arrows"": [
                {
                    ""fr"": 0,
                    ""to"": 1
                },
                {
                    ""fr"": 1,
                    ""to"": 2
                }
            ]
        }";

        var value = ((await controller.SearchRoutes(new() { query = query })).Result as ObjectResult).Value;
        var hasError = (value as ValidationProblemDetails).Errors.ContainsKey("query");

        Assert.IsTrue(hasError);
    }

    [TestMethod]
    public async Task ShouldReturnServerErrorDueToFailingEntityIndex()
    {
        var context = new SearchContext()
        {
            EntityIndex = new FakeFailingEntityIndex(),
            RoutingEngine = new FakeWorkingRoutingEngine()
        };
        var controller = new SearchController(context, new FakeLogger<SearchController>());

        var result = (await controller.SearchRoutes(new() { query = VALID_ROUTES_QUERY })).Result as StatusCodeResult;

        Assert.AreEqual(StatusCodes.Status500InternalServerError, result.StatusCode);
    }

    [TestMethod]
    public async Task ShouldReturnServerErrorDueToFailingRoutingEngine()
    {
        var context = new SearchContext()
        {
            EntityIndex = new FakeWorkingEntityIndex(),
            RoutingEngine = new FakeFailingRoutingEngine()
        };
        var controller = new SearchController(context, new FakeLogger<SearchController>());

        var result = (await controller.SearchRoutes(new() { query = VALID_ROUTES_QUERY })).Result as StatusCodeResult;

        Assert.AreEqual(StatusCodes.Status500InternalServerError, result.StatusCode);
    }

    [TestMethod]
    public async Task ShouldReturnListOfRoutes()
    {
        var context = new SearchContext()
        {
            EntityIndex = new FakeWorkingEntityIndex(),
            RoutingEngine = new FakeWorkingRoutingEngine()
        };
        var controller = new SearchController(context, new FakeLogger<SearchController>());

        var value = (await controller.SearchRoutes(new() { query = VALID_ROUTES_QUERY })).Value;

        Assert.IsTrue(value is not null);
    }
}
