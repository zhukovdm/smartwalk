using System.Collections.Generic;
using System.Net.Mime;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SmartWalk.Api.Helpers;
using SmartWalk.Application.Entities;
using SmartWalk.Application.Parsers;
using SmartWalk.Core.Entities;

namespace SmartWalk.Api.Controllers;

using Direc = ShortestPath;

[ApiController]
public sealed class SearchDirecsController : SearchControllerBase
{
    private readonly ISearchDirecsQueryHandler handler;

    public SearchDirecsController(ILogger<SearchDirecsController> logger, ISearchDirecsQueryHandler handler)
        : base(logger)
    {
        this.handler = handler;
    }

    /// <param name="request">Request object with embedded query.</param>
    /// <returns>Response object.</returns>
    /// <response code="200">Valid list of directions.</response>
    /// <response code="400">Invalid query structure.</response>
    /// <response code="500">Some of the backend services malfunction.</response>
    [HttpGet]
    [Route("/api/search/direcs", Name = "SearchDirecs")]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public Task<ActionResult<List<Direc>>> Search([FromQuery] SearchDirecsRequest request)
    {
        return SearchT(request.query, new SearchDirecsQueryParser(), handler);
    }
}
