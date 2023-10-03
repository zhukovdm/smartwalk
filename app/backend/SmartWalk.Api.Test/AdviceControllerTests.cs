using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using SmartWalk.Api.Contexts;
using SmartWalk.Api.Controllers;
using SmartWalk.Api.Test.Fakes;
using static SmartWalk.Api.Controllers.AdviceController;

namespace SmartWalk.Api.Test;

[TestClass]
public class AdviceControllerAdviseKeywordsTests
{
    private KeywordsRequest GetValidKeywordsRequest()
    {
        return new() { prefix = "m", count = 5 };
    }

    [TestMethod]
    public async Task ShouldReturnServerErrorDueToFailingAdvicer()
    {
        var context = new AdviceContext()
        {
            KeywordAdvicer = new FakeFailingKeywordAdvicer()
        };
        var controller = new AdviceController(context, new FakeLogger<AdviceController>());

        var response = (await controller.AdviseKeywords(GetValidKeywordsRequest())).Result as StatusCodeResult;

        Assert.AreEqual(StatusCodes.Status500InternalServerError, response.StatusCode);
    }

    [TestMethod]
    public async Task ShouldReturnKeywordAdviceItems()
    {
        var context = new AdviceContext()
        {
            KeywordAdvicer = new FakeWorkingKeywordAdvicer()
        };
        var controller = new AdviceController(context, new FakeLogger<AdviceController>());

        var items = (await controller.AdviseKeywords(GetValidKeywordsRequest())).Value;

        Assert.AreEqual(1, items.Count);
    }
}
