using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using SmartWalk.Api.Controllers;
using SmartWalk.Api.Test.Fakes;
using SmartWalk.Application.Entities;
using SmartWalk.Application.Handlers;

namespace SmartWalk.Api.Test;

[TestClass]
public class AdviceKeywordsControllerTests
{
    private GetAdviceKeywordsRequest GetValidAdviceKeywordsRequest()
    {
        return new() { prefix = "m", count = 5 };
    }

    // Validator is trivial

    // Handler

    [TestMethod]
    public async Task ShouldReturnKeywordAdviceItems()
    {
        var controller = new AdviceKeywordsController(
            new FakeLogger<AdviceKeywordsController>(), new GetAdviceKeywordsQueryHandler(new FakeWorkingKeywordAdvicer()));

        var items = (await controller.Get(GetValidAdviceKeywordsRequest())).Value;

        Assert.AreEqual(1, items.Count);
    }

    // Exception

    [TestMethod]
    public async Task ShouldReturnServerErrorDueToFailingAdvicer()
    {
        var controller = new AdviceKeywordsController(
            new FakeLogger<AdviceKeywordsController>(), new GetAdviceKeywordsQueryHandler(new FakeFailingKeywordAdvicer()));

        var response = (await controller.Get(GetValidAdviceKeywordsRequest())).Result as StatusCodeResult;

        Assert.AreEqual(StatusCodes.Status500InternalServerError, response.StatusCode);
    }
}
