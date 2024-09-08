using System;
using System.Collections.Generic;
using System.Net.Mime;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SmartWalk.Application.Entities;
using SmartWalk.Application.Interfaces;
using SmartWalk.Application.Validators;
using SmartWalk.Core.Entities;

namespace SmartWalk.Api.Controllers;

[ApiController]
public sealed class AdviceKeywordsController : ControllerBase
{
    private readonly IErrors errors;

    private readonly ILogger<AdviceKeywordsController> logger;

    private readonly IGetAdviceKeywordsQueryHandler handler;

    public AdviceKeywordsController(ILogger<AdviceKeywordsController> logger, IGetAdviceKeywordsQueryHandler handler)
    {
        this.errors = new ModelStateWrapper(ModelState); this.logger = logger; this.handler = handler;
    }

    /// <param name="request">Valid request object.</param>
    /// <returns>List of autocomplete items.</returns>
    /// <response code="200">Valid response with autocomplete items.</response>
    /// <response code="500">Some of the backend services malfunction.</response>
    [HttpGet]
    [Route("api/advice/keywords", Name = "GetAdviceKeywords")]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<List<KeywordAdviceItem>>> Get([FromQuery] GetAdviceKeywordsRequest request)
    {
        var responder = new GetAdviceKeywordsResponder();

        if (!new GetAdviceKeywordsValidator().Validate(errors, new()))
        {
            return responder.Invalid(this);
        }

        try
        {
            var result = await handler.Handle(new() { prefix = request.prefix, count = request.count.Value });

            return responder.Respond(result);
        }
        catch (Exception ex)
        {
            logger.LogError(ex.Message);
            return responder.Failure();
        }
    }
}
