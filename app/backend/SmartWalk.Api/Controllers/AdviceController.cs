using System;
using System.Collections.Generic;
using System.Net.Mime;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SmartWalk.Application.Entities;
using SmartWalk.Application.Handlers;
using SmartWalk.Application.Validators;
using SmartWalk.Core.Entities;

namespace SmartWalk.Api.Controllers;

[ApiController]
[Route("api/advice")]
public sealed class AdviceController : ControllerBase
{
    private readonly AdviseKeywordsHandler handler;
    private readonly ILogger<AdviceController> logger;

    public AdviceController(ILogger<AdviceController> logger, AdviseKeywordsHandler handler)
    {
        this.logger = logger;
        this.handler = handler;
    }

    /// <param name="request">Valid request object.</param>
    /// <returns>List of autocomplete items.</returns>
    /// <response code="200">Valid response with autocomplete items.</response>
    /// <response code="500">Some of the backend services malfunction.</response>
    [HttpGet]
    [Route("keywords", Name = "AdviseKeywords")]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<List<KeywordAdviceItem>>> AdviseKeywords([FromQuery] AdviseKeywordsRequest request)
    {
        var responder = new AdviseKeywordsResponder();

        if (!new AdviseKeywordsValidator(new ModelStateWrapper(ModelState)).Validate(new()))
        {
            return responder.Invalid(this);
        }

        try
        {
            var result = await handler
                .Handle(new() { prefix = request.prefix, count = request.count.Value });

            return responder.Respond(result);
        }
        catch (Exception ex)
        {
            logger.LogError(ex.Message);
            return responder.Failure();
        }
    }
}
