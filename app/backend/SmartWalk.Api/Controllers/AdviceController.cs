using System;
using System.Collections.Generic;
using System.Net.Mime;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SmartWalk.Application.Entities;
using SmartWalk.Application.Handlers;
using SmartWalk.Application.Interfaces;
using SmartWalk.Core.Entities;

namespace SmartWalk.Api.Controllers;

[ApiController]
[Route("api/advice")]
public sealed class AdviceController : ControllerBase
{
    private readonly IAdviceContext _ctx;
    private readonly ILogger<AdviceController> _logger;

    public AdviceController(IAdviceContext ctx, ILogger<AdviceController> logger)
    {
        _ctx = ctx; _logger = logger;
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
        try
        {
            return await new AdviseKeywordsHandler(_ctx.KeywordAdvicer)
                .Handle(new() { prefix = request.prefix, count = request.count.Value });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex.Message);
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }
}
