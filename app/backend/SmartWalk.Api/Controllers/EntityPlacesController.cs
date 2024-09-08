using System;
using System.Net.Mime;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SmartWalk.Application.Interfaces;
using SmartWalk.Application.Validators;
using SmartWalk.Core.Entities;

namespace SmartWalk.Api.Controllers;

[ApiController]
public sealed class EntityPlacesController : ControllerBase
{
    private readonly IErrors errors;

    private readonly ILogger<EntityPlacesController> logger;

    private readonly IGetEntityPlaceQueryHandler handler;

    public EntityPlacesController(ILogger<EntityPlacesController> logger, IGetEntityPlaceQueryHandler handler)
    {
        errors = new ModelStateWrapper(ModelState); this.logger = logger; this.handler = handler;
    }

    /// <param name="smartId" example="64c91f8359914b93b23b01d9"></param>
    /// <returns>Unique place that has the same identifier.</returns>
    /// <response code="200">Valid place object.</response>
    /// <response code="400">Invalid identifier detected.</response>
    /// <response code="404">An entity with identifier does not exist.</response>
    /// <response code="500">Some of the backend services malfunction.</response>
    [HttpGet]
    [Route("api/entity/places/{smartId}", Name = "GetEntityPlace")]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<ExtendedPlace>> Get(string smartId)
    {
        var responder = new GetEntityPlaceResponder();

        if (!new GetEntityPlaceValidator().Validate(errors, smartId))
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
