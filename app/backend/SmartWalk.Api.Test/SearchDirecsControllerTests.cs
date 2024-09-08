using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using SmartWalk.Api.Controllers;
using SmartWalk.Api.Test.Fakes;
using SmartWalk.Application.Handlers;

namespace SmartWalk.Api.Test;

[TestClass]
public class SearchDirecsControllerTests
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

    // Parser

    [TestMethod]
    public async Task ShouldReturnBadRequestDueToInvalidQueryString()
    {
        var controller = new SearchDirecsController(
            new FakeLogger<SearchDirecsController>(), new SearchDirecsQueryHandler(new FakeWorkingShortestPathFinder()));

        var query = "{}";
        var value = ((await controller.Search(new() { query = query })).Result as ObjectResult).Value;
        var hasError = (value as ValidationProblemDetails).Errors.ContainsKey("query");

        Assert.IsTrue(hasError);
    }

    // Handler

    [TestMethod]
    public async Task ShouldReturnListOfDirections()
    {
        var controller = new SearchDirecsController(
            new FakeLogger<SearchDirecsController>(), new SearchDirecsQueryHandler(new FakeWorkingShortestPathFinder()));

        var value = (await controller.Search(new() { query = VALID_DIRECS_QUERY })).Value;

        Assert.IsTrue(value is not null);
    }

    // Exception

    [TestMethod]
    public async Task ShouldReturnServerErrorDueToFailingRoutingEngine()
    {
        var controller = new SearchDirecsController(
            new FakeLogger<SearchDirecsController>(), new SearchDirecsQueryHandler(new FakeFailingShortestPathFinder()));

        var result = (await controller.Search(new() { query = VALID_DIRECS_QUERY })).Result as StatusCodeResult;

        Assert.AreEqual(StatusCodes.Status500InternalServerError, result.StatusCode);
    }
}
