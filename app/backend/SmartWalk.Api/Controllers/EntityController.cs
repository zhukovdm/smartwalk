using System;
using System.Collections.Generic;
using System.Net.Mime;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;
using SmartWalk.Api.Contexts;
using SmartWalk.Model.Entities;
using SmartWalk.Service;

namespace SmartWalk.Api.Controllers;

[ApiController]
[Route("api/entity")]
public sealed class EntityController : ControllerBase
{
    private readonly IEntityContext _context;
    private readonly ILogger<EntityController> _logger;

    private static bool VerifySmartId(string smartId) => ObjectId.TryParse(smartId, out _);

    public EntityController(IEntityContext context, ILogger<EntityController> logger)
    {
        _context = context; _logger = logger;
    }

    /// <summary></summary>
    /// <param name="smartId" example="64c91f8359914b93b23b01d9"></param>
    /// <response code="200">Returns object with an entity item.</response>
    /// <response code="400">Invalid identifier detected.</response>
    /// <response code="404">An entity with identifier does not exist.</response>
    /// <response code="500">Some of the backend services malfunction.</response>
    [HttpGet]
    [Route("places/{smartId}", Name = "GetPlace")]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ExtendedPlace>> GetPlace(string smartId)
    {
        if (!VerifySmartId(smartId))
        {
            return BadRequest(new ValidationProblemDetails(new Dictionary<string, string[]>
            {
                { "smartId", new string[] { "Malformed identifier." } }
            }));
        }

        try
        {
            var place = await PlacesService.GetPlace(_context.Store, smartId);
            return (place is not null) ? place : NotFound();
        }
        catch (Exception ex) { _logger.LogError(ex.Message); return StatusCode(500); }
    }
}
