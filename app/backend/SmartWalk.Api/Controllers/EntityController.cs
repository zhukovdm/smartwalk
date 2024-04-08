using System;
using System.Net.Mime;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SmartWalk.Application.Handlers;
using SmartWalk.Application.Interfaces;
using SmartWalk.Application.Validators;
using SmartWalk.Core.Entities;

namespace SmartWalk.Api.Controllers;

[ApiController]
[Route("api/entity")]
public sealed class EntityController : ControllerBase
{
    private readonly GetPlaceHandler handler;
    private readonly ILogger<EntityController> logger;

    public EntityController(ILogger<EntityController> logger, GetPlaceHandler handler)
    {
        this.logger = logger; this.handler = handler;
    }

    /// <param name="smartId" example="64c91f8359914b93b23b01d9"></param>
    /// <returns>Unique place that has the same identifier.</returns>
    /// <response code="200">Valid place object.</response>
    /// <response code="400">Invalid identifier detected.</response>
    /// <response code="404">An entity with identifier does not exist.</response>
    /// <response code="500">Some of the backend services malfunction.</response>
    [HttpGet]
    [Route("places/{smartId}", Name = "GetPlace")]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ExtendedPlace>> GetPlace(string smartId)
    {
        var responder = new GetPlaceResponder();

        if (!new GetPlaceValidator(new ModelStateWrapper(ModelState)).Validate(smartId))
        {
            return responder.Invalid(this);
        }

        try
        {
            var result = await handler.Handle(new() { smartId = smartId });

            return responder.Respond(result);
        }
        catch (Exception ex)
        {
            logger.LogError(ex.Message);
            return responder.Failure();
        }
    }
}
