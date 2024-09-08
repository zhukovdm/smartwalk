using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using SmartWalk.Api.Controllers;
using SmartWalk.Api.Test.Fakes;
using SmartWalk.Application.Handlers;

namespace SmartWalk.Api.Test;

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

    // Parser

    [TestMethod]
    public async Task ShouldReturnBadRequestDueToInvalidQueryString()
    {
        var controller = new SearchPlacesController(
            new FakeLogger<SearchPlacesController>(), new SearchPlacesQueryHandler(new FakeWorkingEntityIndex()));

        var value = ((await controller.Search(new() { query = "{}" })).Result as ObjectResult).Value;
        var hasError = (value as ValidationProblemDetails).Errors.ContainsKey("query");

        Assert.IsTrue(hasError);
    }

    // Handler

    [TestMethod]
    public async Task ShouldReturnListOfPlaces()
    {
        var controller = new SearchPlacesController(
            new FakeLogger<SearchPlacesController>(), new SearchPlacesQueryHandler(new FakeWorkingEntityIndex()));

        var value = (await controller.Search(new() { query = VALID_PLACES_QUERY })).Value;

        Assert.IsTrue(value is not null);
    }

    // Exception

    [TestMethod]
    public async Task ShouldReturnServerErrorDueToFailingEntityIndex()
    {
        var controller = new SearchPlacesController(
            new FakeLogger<SearchPlacesController>(), new SearchPlacesQueryHandler(new FakeFailingEntityIndex()));

        var result = (await controller.Search(new() { query = VALID_PLACES_QUERY })).Result as StatusCodeResult;

        Assert.AreEqual(StatusCodes.Status500InternalServerError, result.StatusCode);
    }
}
