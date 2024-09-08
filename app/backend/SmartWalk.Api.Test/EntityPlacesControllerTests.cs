using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using SmartWalk.Api.Controllers;
using SmartWalk.Api.Test.Fakes;
using SmartWalk.Application.Handlers;

namespace SmartWalk.Api.Test;

[TestClass]
public class EntityControllerGetPlaceTests
{
    // Validator

    [TestMethod]
    public async Task ShouldReturnBadRequestDueToMalformedSmartId()
    {
        var controller = new EntityPlacesController(
            new FakeLogger<EntityPlacesController>(), new GetEntityPlaceQueryHandler(new FakeWorkingEntityStore()));

        var value = ((await controller.Get("a0")).Result as ObjectResult).Value;
        var hasError = (value as ValidationProblemDetails).Errors.ContainsKey("smartId");

        Assert.IsTrue(hasError);
    }

    // Handler

    [TestMethod]
    public async Task ShouldReturnNotFoundDueToMissingSmartId()
    {
        var controller = new EntityPlacesController(
            new FakeLogger<EntityPlacesController>(), new GetEntityPlaceQueryHandler(new FakeWorkingEntityStore()));

        var result = (await controller.Get("707f1f77bcf86cd799439011")).Result as StatusCodeResult;

        Assert.AreEqual(StatusCodes.Status404NotFound, result.StatusCode);
    }

    [TestMethod]
    public async Task ShouldReturnValidValueObject()
    {
        var controller = new EntityPlacesController(
            new FakeLogger<EntityPlacesController>(), new GetEntityPlaceQueryHandler(new FakeWorkingEntityStore()));

        var responseValue = (await controller.Get(FakeWorkingEntityStore.EXISTING_SMART_ID)).Value;

        Assert.IsTrue(responseValue is not null);
    }

    // Exception

    [TestMethod]
    public async Task ShouldReturnServerErrorDueToFailingEntityStore()
    {
        var controller = new EntityPlacesController(
            new FakeLogger<EntityPlacesController>(), new GetEntityPlaceQueryHandler(new FakeFailingEntityStore()));

        var result = (await controller.Get(FakeWorkingEntityStore.EXISTING_SMART_ID)).Result as StatusCodeResult;

        Assert.AreEqual(StatusCodes.Status500InternalServerError, result.StatusCode);
    }
}
