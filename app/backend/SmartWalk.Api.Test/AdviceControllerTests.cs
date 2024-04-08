using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using SmartWalk.Api.Controllers;
using SmartWalk.Application.Entities;

namespace SmartWalk.Api.Test;

[TestClass]
public class AdviceControllerAdviseKeywordsTests
{
    private AdviseKeywordsRequest GetValidAdviseKeywordsRequest()
    {
        return new() { prefix = "m", count = 5 };
    }

    // Validator is trivial

    // Handler

    [TestMethod]
    public async Task ShouldReturnKeywordAdviceItems()
    {
        var controller = new AdviceController(
            new FakeLogger<AdviceController>(), new FakeWorkingKeywordAdvicer());

        var items = (await controller.AdviseKeywords(GetValidAdviseKeywordsRequest())).Value;

        Assert.AreEqual(1, items.Count);
    }

    // Exception

    [TestMethod]
    public async Task ShouldReturnServerErrorDueToFailingAdvicer()
    {
        var controller = new AdviceController(
            new FakeLogger<AdviceController>(), new FakeFailingKeywordAdvicer());

        var response = (await controller.AdviseKeywords(GetValidAdviseKeywordsRequest())).Result as StatusCodeResult;

        Assert.AreEqual(StatusCodes.Status500InternalServerError, response.StatusCode);
    }
}
