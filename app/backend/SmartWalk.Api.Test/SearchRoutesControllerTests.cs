using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using SmartWalk.Api.Controllers;
using SmartWalk.Api.Test.Fakes;
using SmartWalk.Application.Handlers;

namespace SmartWalk.Api.Test;

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

    // Parser

    [TestMethod]
    public async Task ShouldReturnBadRequestDueToInvalidQueryString()
    {
        var controller = new SearchRoutesController(
            new FakeLogger<SearchRoutesController>(), new SearchRoutesQueryHandler(new FakeWorkingEntityIndex(), new FakeWorkingShortestPathFinder()));

        var query = "{}";
        var value = ((await controller.SearchRoutes(new() { query = query })).Result as ObjectResult).Value;
        var hasError = (value as ValidationProblemDetails).Errors.ContainsKey("query");

        Assert.IsTrue(hasError);
    }

    [TestMethod]
    public async Task ShouldReturnBadRequestDueToInvalidArrowConfiguration()
    {
        var controller = new SearchRoutesController(
            new FakeLogger<SearchRoutesController>(), new SearchRoutesQueryHandler(new FakeWorkingEntityIndex(), new FakeWorkingShortestPathFinder()));

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
        var controller = new SearchRoutesController(
            new FakeLogger<SearchRoutesController>(), new SearchRoutesQueryHandler(new FakeWorkingEntityIndex(), new FakeWorkingShortestPathFinder()));

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

    // Handler

    [TestMethod]
    public async Task ShouldReturnListOfRoutes()
    {
        var controller = new SearchRoutesController(
            new FakeLogger<SearchRoutesController>(), new SearchRoutesQueryHandler(new FakeWorkingEntityIndex(), new FakeWorkingShortestPathFinder()));

        var value = (await controller.SearchRoutes(new() { query = VALID_ROUTES_QUERY })).Value;

        Assert.IsTrue(value is not null);
    }

    // Exception

    [TestMethod]
    public async Task ShouldReturnServerErrorDueToFailingEntityIndex()
    {
        var controller = new SearchRoutesController(
            new FakeLogger<SearchRoutesController>(), new SearchRoutesQueryHandler(new FakeFailingEntityIndex(), new FakeWorkingShortestPathFinder()));

        var result = (await controller.SearchRoutes(new() { query = VALID_ROUTES_QUERY })).Result as StatusCodeResult;

        Assert.AreEqual(StatusCodes.Status500InternalServerError, result.StatusCode);
    }

    [TestMethod]
    public async Task ShouldReturnServerErrorDueToFailingRoutingEngine()
    {
        var controller = new SearchRoutesController(
            new FakeLogger<SearchRoutesController>(), new SearchRoutesQueryHandler(new FakeWorkingEntityIndex(), new FakeFailingShortestPathFinder()));

        var result = (await controller.SearchRoutes(new() { query = VALID_ROUTES_QUERY })).Result as StatusCodeResult;

        Assert.AreEqual(StatusCodes.Status500InternalServerError, result.StatusCode);
    }
}
