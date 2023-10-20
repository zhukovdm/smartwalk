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
using SmartWalk.Application.Parsers;
using SmartWalk.Core.Entities;

namespace SmartWalk.Api.Controllers;

using Direc = ShortestPath;
using Model = ModelStateWrapper;

[ApiController]
[Route("api/search")]
public sealed class SearchController : ControllerBase
{
    /// <summary>Concrete handling.</summary>
    /// <typeparam name="V">Validate against.</typeparam>
    /// <typeparam name="D">Deserialize as and handle.</typeparam>
    /// <typeparam name="T">Response of a handler.</typeparam>
    /// <param name="query">Received query string.</param>
    /// <param name="parser">Constructor of a parser with validation capabilities.</param>
    /// <param name="handler">Request handler.</param>
    /// <returns>Response object.</returns>
    private async Task<ActionResult<T>> SearchT<V, D, T>(
        string query, Func<Model, IQueryParser<V, D>> parser, IQueryHandler<D, T> handler)
    {
        if (!parser(new ModelStateWrapper(ModelState)).TryParse(query, out var queryObject))
        {
            return ValidationProblem();
        }

        try
        {
            return await handler.Handle(queryObject);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex.Message);
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }

    private readonly ISearchContext _ctx;
    private readonly ILogger<SearchController> _logger;

    public SearchController(ISearchContext ctx, ILogger<SearchController> logger)
    {
        _ctx = ctx; _logger = logger;
    }

    /// <param name="request">Request object with embedded query.</param>
    /// <returns>Response object.</returns>
    /// <response code="200">Valid list of directions.</response>
    /// <response code="400">Invalid query structure.</response>
    /// <response code="500">Some of the backend services malfunction.</response>
    [HttpGet]
    [Route("direcs", Name = "SearchDirecs")]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public Task<ActionResult<List<Direc>>> SearchDirecs([FromQuery] SearchDirecsRequest request)
    {
        return SearchT(request.query, (Model model) => new SearchDirecsQueryParser(model), new SearchDirecsHandler(_ctx.RoutingEngine));
    }

    /// <param name="request">Request object with embedded query.</param>
    /// <returns>Response object.</returns>
    /// <response code="200">Valid list of places.</response>
    /// <response code="400">Invalid query structure.</response>
    /// <response code="500">Some of the backend services malfunction.</response>
    [HttpGet]
    [Route("places", Name = "SearchPlaces")]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public Task<ActionResult<List<Place>>> SearchPlaces([FromQuery] SearchPlacesRequest request)
    {
        return SearchT(request.query, (Model model) => new SearchPlacesQueryParser(model), new SearchPlacesHandler(_ctx.EntityIndex));
    }

    /// <param name="request">Request object with embedded query.</param>
    /// <returns>Response object.</returns>
    /// <response code="200">Valid list of routes.</response>
    /// <response code="400">Invalid query structure.</response>
    /// <response code="500">Some of the backend services malfunction.</response>
    [HttpGet]
    [Route("routes", Name = "SearchRoutes")]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public Task<ActionResult<List<Route>>> SearchRoutes([FromQuery] SearchRoutesRequest request)
    {
        return SearchT(request.query, (Model model) => new SearchRoutesQueryParser(model), new SearchRoutesHandler(_ctx.EntityIndex, _ctx.RoutingEngine));
    }
}
