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
    private readonly IAdviceContext _context;
    private readonly ILogger<AdviceController> _logger;

    public AdviceController(IAdviceContext context, ILogger<AdviceController> logger)
    {
        _context = context; _logger = logger;
    }

    public sealed class KeywordsRequest
    {
        /// <example>m</example>
        [Required]
        [MinLength(1)]
        public string prefix { get; init; }

        /// <example>5</example>
        [Required]
        [Range(1, int.MaxValue)]
        public int? count { get; init; }
    }

    [HttpGet]
    [Route("keywords", Name = "AdviseKeywords")]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<List<KeywordsAdviceItem>>> AdviseKeywords([FromQuery] KeywordsRequest request)
    {
        try {
            return await AdviceService.GetKeywords(
                _context.KeywordsAdvicer, request.prefix, request.count.Value);
        }
        catch (Exception ex) { _logger.LogError(ex.Message); return StatusCode(500); }
    }
}
