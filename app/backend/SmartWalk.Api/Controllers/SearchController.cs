using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net.Mime;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using NJsonSchema;
using SmartWalk.Api.Contexts;
using SmartWalk.Core.Algorithms;
using SmartWalk.Domain.Entities;
using SmartWalk.Service;

namespace SmartWalk.Api.Controllers;

using Direc = ShortestPath;

[ApiController]
[Route("api/search")]
public sealed class SearchController : ControllerBase
{
    public class AnyRequest
    {
        [Required]
        [MinLength(1)]
        public string query { get; init; }
    }

    private static ProblemDetails GetProblemDetails(int status, string detail)
    {
        return new() { Status = status, Detail = detail };
    }

    private static bool VerifyPrecedence(List<WebPrecedenceEdge> edges, int order)
    {
        var g = new CycleDetector(order);

        foreach (var e in edges)
        {
            var fr = e.fr.Value;
            var to = e.to.Value;

            if (fr == to || fr >= order || to >= order) { return false; }

            g.AddEdge(fr, to);
        }

        return g.Cycle() is null;
    }

    internal static T DeserializeQuery<T>(string query, JsonSchema schema)
    {
        var errors = schema.Validate(query).ToList();
        return errors.Count == 0
            ? JsonSerializer.Deserialize<T>(query)
            : throw new Exception(string.Join(", ", errors.Select((e) => e.Path + ' ' + e.Kind)));
    }

    /// <summary>
    /// Representation of a point in EPSG:4326 restricted to the range of EPSG:3857.
    /// See https://epsg.io/4326 and https://epsg.io/3857 for details.
    /// </summary>
    internal sealed class WebPoint
    {
        [Required]
        [Range(-180.0, +180.0)]
        public double? lon { get; init; }

        [Required]
        [Range(-85.06, +85.06)]
        public double? lat { get; init; }

        public WgsPoint AsWgs() => new(lon.Value, lat.Value);
    }

    internal sealed class WebPrecedenceEdge
    {
        [Required]
        [Range(0, int.MaxValue)]
        public int? fr { get; init; }

        [Required]
        [Range(0, int.MaxValue)]
        public int? to { get; init; }
    }

    internal sealed class DirecsQuery
    {
        [Required]
        [MinLength(2)]
        public List<WebPoint> waypoints { get; init; }
    }

    private static readonly JsonSchema _direcsSchema = JsonSchema.FromType<DirecsQuery>();

    private readonly ISearchContext _context;
    private readonly ILogger<SearchController> _logger;

    public SearchController(ISearchContext context, ILogger<SearchController> logger)
    {
        _context = context; _logger = logger;
    }

    [HttpGet]
    [Route("direcs", Name = "SearchDirecs")]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<List<Direc>>> SearchDirecs([FromQuery] AnyRequest request)
    {
        DirecsQuery dq = null;

        try
        {
            dq = DeserializeQuery<DirecsQuery>(request.query, _direcsSchema);
        }
        catch (Exception ex) { return BadRequest(GetProblemDetails(400, ex.Message)); }

        try
        {
            return await SearchService.GetDirecs(_context.Engine, dq.waypoints.Select((p) => p.AsWgs()).ToList());
        }
        catch (Exception ex) { _logger.LogError(ex.Message); return StatusCode(500); }
    }

    internal sealed class PlacesQuery
    {
        [Required]
        public WebPoint center { get; init; }

        /// <summary>
        /// Radius around the center (in meters).
        /// </summary>
        [Required]
        [Range(0, 12_000)]
        public double? radius { get; init; }

        [Required]
        public List<Category> categories { get; init; }

        [Required]
        [Range(0, int.MaxValue)]
        public int? offset { get; init; }

        [Required]
        [Range(0, int.MaxValue)]
        public int? bucket { get; init; }
    }

    private static readonly JsonSchema _placesSchema = JsonSchema.FromType<PlacesQuery>();

    [HttpGet]
    [Route("places", Name = "SearchPlaces")]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<List<Place>>> SearchPlaces([FromQuery] AnyRequest request)
    {
        PlacesQuery pq = null;

        try
        {
            pq = DeserializeQuery<PlacesQuery>(request.query, _placesSchema);
        }
        catch (Exception ex) { return BadRequest(GetProblemDetails(400, ex.Message)); }

        try
        {
            return await SearchService.GetPlaces(
                _context.Index, pq.center.AsWgs(), pq.radius.Value, pq.categories, pq.offset.Value, pq.bucket.Value);
        }
        catch (Exception ex) { _logger.LogError(ex.Message); return StatusCode(500); }
    }

    internal sealed class RoutesQuery
    {
        [Required]
        public WebPoint source { get; init; }

        [Required]
        public WebPoint target { get; init; }

        /// <summary>
        /// Maximum walking distance in <b>meters</b>.
        /// </summary>
        [Required]
        [Range(0, 30_000)]
        public double? distance { get; init; }

        [Required]
        [MinLength(1)]
        public List<Category> categories { get; init; }

        [Required]
        public List<WebPrecedenceEdge> precedence { get; init; }
    }

    private static readonly JsonSchema _routesSchema = JsonSchema.FromType<RoutesQuery>();

    [HttpGet]
    [Route("routes", Name = "SearchRoutes")]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<List<Route>>> SearchRoutes([FromQuery] AnyRequest request)
    {
        RoutesQuery rq = null;

        try
        {
            rq = DeserializeQuery<RoutesQuery>(request.query, _routesSchema);
            if (!VerifyPrecedence(rq.precedence, rq.categories.Count)) { throw new Exception("Malformed precedence graph"); }
        }
        catch (Exception ex) { return BadRequest(GetProblemDetails(400, ex.Message)); }

        var precedence = rq.precedence
            .Select(p => new PrecedenceEdge() { fr = p.fr.Value, to = p.to.Value }).ToList();

        try
        {
            return await SearchService.GetRoutes(
                _context.Index, _context.Engine, rq.source.AsWgs(), rq.target.AsWgs(), rq.distance.Value, rq.categories, precedence);
        }
        catch (Exception ex) { _logger.LogError(ex.Message); return StatusCode(500); }
    }
}
