using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Net.Mime;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SmartWalk.Api.Contexts;
using SmartWalk.Domain.Entities;
using SmartWalk.Service;

namespace SmartWalk.Api.Controllers;

[ApiController]
[Route("api/advice")]
public sealed class AdviceController : ControllerBase
{
    public sealed class KeywordsRequest
    {
        /// <example>m</example>
        [Required]
        [MinLength(1)]
        public string prefix { get; set; }

        /// <example>5</example>
        [Required]
        [Range(1, int.MaxValue)]
        public int count { get; set; }
    }

    private readonly IAdviceContext _context;
    private readonly ILogger<AdviceController> _logger;

    public AdviceController(IAdviceContext context, ILogger<AdviceController> logger)
    {
        _context = context; _logger = logger;
    }

    [HttpGet]
    [Route("bounds", Name = "AdviseBounds")]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public ActionResult<Bounds> AdviseBounds()
    {
        return AdviceService.GetBounds(_context.Bounds);
    }

    [HttpGet]
    [Route("keywords", Name = "AdviseKeywords")]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<List<Keyword>>> AdviseKeywords([FromQuery] KeywordsRequest request)
    {
        try {
            return await AdviceService.GetKeywords(
                _context.KeywordAdvicer, request.prefix, request.count);
        }
        catch (Exception ex) { _logger.LogError(ex.Message); return StatusCode(500); }
    }
}
