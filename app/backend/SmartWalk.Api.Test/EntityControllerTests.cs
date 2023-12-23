using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using SmartWalk.Api.Controllers;
using SmartWalk.Application.Entities;

namespace SmartWalk.Api.Test;

[TestClass]
public class EntityControllerGetPlaceTests
{
    // Validator

    [TestMethod]
    public async Task ShouldReturnBadRequestDueToMalformedSmartId()
    {
        var context = new EntityContext()
        {
            EntityStore = new FakeWorkingEntityStore()
        };
        var controller = new EntityController(context, new FakeLogger<EntityController>());

        var value = ((await controller.GetPlace("a0")).Result as ObjectResult).Value;
        var hasError = (value as ValidationProblemDetails).Errors.ContainsKey("smartId");

        Assert.IsTrue(hasError);
    }

    // Handler

    [TestMethod]
    public async Task ShouldReturnNotFoundDueToMissingSmartId()
    {
        var context = new EntityContext()
        {
            EntityStore = new FakeWorkingEntityStore()
        };
        var controller = new EntityController(context, new FakeLogger<EntityController>());

        var result = (await controller.GetPlace("707f1f77bcf86cd799439011")).Result as StatusCodeResult;

        Assert.AreEqual(StatusCodes.Status404NotFound, result.StatusCode);
    }

    [TestMethod]
    public async Task ShouldReturnValidValueObject()
    {
        var context = new EntityContext()
        {
            EntityStore = new FakeWorkingEntityStore()
        };
        var controller = new EntityController(context, new FakeLogger<EntityController>());

        var responseValue = (await controller.GetPlace(FakeWorkingEntityStore.EXISTING_SMART_ID)).Value;

        Assert.IsTrue(responseValue is not null);
    }

    // Exception

    [TestMethod]
    public async Task ShouldReturnServerErrorDueToFailingEntityStore()
    {
        var context = new EntityContext()
        {
            EntityStore = new FakeFailingEntityStore()
        };
        var controller = new EntityController(context, new FakeLogger<EntityController>());

        var result = (await controller.GetPlace(FakeWorkingEntityStore.EXISTING_SMART_ID)).Result as StatusCodeResult;

        Assert.AreEqual(StatusCodes.Status500InternalServerError, result.StatusCode);
    }
}
