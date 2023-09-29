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
using SmartWalk.Model.Entities;
using SmartWalk.Service;

namespace SmartWalk.Api.Controllers;

using Direc = ShortestPath;

[ApiController]
[Route("api/search")]
public sealed class SearchController : ControllerBase
{
    internal static bool ValidateQuery<T>(string query, JsonSchema schema, out List<string> errors)
    {
        try
        {
            errors = schema.Validate(query)
                .Select((e) => $"{e.Kind} at {e.Path}, line {e.LineNumber}, position {e.LinePosition}.").ToList();
        }
        catch (Exception) { errors = new() { "Invalid JSON string." }; }

        return errors.Count == 0;
    }

    /// <summary>
    /// Representation of a point in EPSG:4326 restricted to the range of EPSG:3857.
    /// See https://epsg.io/4326 and https://epsg.io/3857 for details.
    /// </summary>
    internal sealed class WebPoint
    {
        /// <example>0.0</example>
        [Required]
        [Range(-180.0, +180.0)]
        public double? lon { get; init; }

        /// <example>0.0</example>
        [Required]
        [Range(-85.06, +85.06)]
        public double? lat { get; init; }

        public WgsPoint AsWgs() => new(Spherical.Round(lon.Value), Spherical.Round(lat.Value));
    }

    internal sealed class WebPrecedenceEdge
    {
        /// <example>0</example>
        [Required]
        [Range(0, int.MaxValue)]
        public int? fr { get; init; }

        /// <example>1</example>
        [Required]
        [Range(0, int.MaxValue)]
        public int? to { get; init; }
    }

    #region SearchDirecs

    public class DirecsRequest
    {
        /// <example>
        /// {"waypoints":[{"lon":14.4035264,"lat":50.0884344},{"lon":14.4057219,"lat":50.0919964}]}
        /// </example>
        [Required]
        [MinLength(1)]
        public string query { get; init; }
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
    public async Task<ActionResult<List<Direc>>> SearchDirecs([FromQuery] DirecsRequest request)
    {
        if (!ValidateQuery<DirecsQuery>(request.query, _direcsSchema, out var queryErrors))
        {
            foreach (var error in queryErrors)
            {
                ModelState.AddModelError("query", error);
            }
            return ValidationProblem();
        }

        var dq = JsonSerializer.Deserialize<DirecsQuery>(request.query);

        try
        {
            return await SearchService.GetDirecs(
                _context.RoutingEngine, dq.waypoints.Select((p) => p.AsWgs()).ToList());
        }
        catch (Exception ex)
        {
            _logger.LogError(ex.Message);
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }

    #endregion

    #region SearchPlaces

    public sealed class PlacesRequest
    {
        /// <example>
        /// {"center":{"lon":14.4035264,"lat":50.0884344},"radius":100,"categories":[]}
        /// </example>
        /// <example>
        /// {"center":{"lon":14.4035264,"lat":50.0884344},"radius":500,"categories":[{"keyword":"museum","filters":{}},{"keyword":"tourism","filters":{}}]}
        /// </example>
        [Required]
        [MinLength(1)]
        public string query { get; init; }
    }

    internal sealed class PlacesQuery
    {
        [Required]
        public WebPoint center { get; init; }

        /// <summary>
        /// Radius around the center (in meters).
        /// </summary>
        [Required]
        [Range(0, 15_000)]
        public double? radius { get; init; }

        [Required]
        public List<Category> categories { get; init; }
    }

    private static readonly JsonSchema _placesSchema = JsonSchema.FromType<PlacesQuery>();

    [HttpGet]
    [Route("places", Name = "SearchPlaces")]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<List<Place>>> SearchPlaces([FromQuery] PlacesRequest request)
    {
        if (!ValidateQuery<PlacesQuery>(request.query, _placesSchema, out var queryErrors))
        {
            foreach (var error in queryErrors)
            {
                ModelState.AddModelError("query", error);
            }
            return ValidationProblem();
        }

        var pq = JsonSerializer.Deserialize<PlacesQuery>(request.query);

        try
        {
            return await SearchService.GetPlaces(
                _context.EntityIndex, pq.center.AsWgs(), pq.radius.Value, pq.categories);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex.Message);
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }

    #endregion

    #region SearchRoutes

    /// <summary>
    /// Check if edges define directed acyclic loop-free graph, repeated edges
    /// are tolerable.
    /// </summary>
    private static bool ValidateArrows(IReadOnlyList<WebPrecedenceEdge> arrows, int order, out string error)
    {
        error = null;
        var detector = new CycleDetector(order);

        foreach (var e in arrows)
        {
            var fr = e.fr.Value;
            var to = e.to.Value;

            if (fr >= order || to >= order)
            {
                error = $"Arrow {fr} → {to} contains an out-of-bound terminal point.";
                return false;
            }

            if (fr == to)
            {
                error = $"Arrow {fr} → {to} is a loop.";
                return false;
            }
            detector.AddEdge(fr, to);
        }

        var cycle = detector.Cycle();

        if (cycle is not null)
        {
            error = $"Cycle {string.Join(" → ", cycle)} detected.";
            return false;
        }
        return true;
    }

    /// <summary>
    /// 
    /// </summary>
    /// <param name="source"></param>
    /// <param name="target"></param>
    /// <param name="maxDistance"></param>
    /// <returns></returns>
    private static bool ValidateRouteMaxDistance(WgsPoint source, WgsPoint target, double maxDistance)
    => Spherical.HaversineDistance(source, target) <= maxDistance && maxDistance <= 30_000;


    public sealed class RoutesRequest
    {
        /// <example>
        /// {"source":{"lon":14.4035264,"lat":50.0884344},"target":{"lon":14.4039444,"lat":50.0894092},"distance":3000,"categories":[{"keyword":"castle","filters":{}},{"keyword":"restaurant","filters":{}},{"keyword":"tourism","filters":{}}],"arrows":[{"fr":0,"to":2}]}
        /// </example>
        [Required]
        [MinLength(1)]
        public string query { get; init; }
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
        public double? maxDistance { get; init; }

        [Required]
        [MinLength(1)]
        public List<Category> categories { get; init; }

        /// <summary>
        /// User-defined ordering on categories.
        /// </summary>
        [Required]
        public List<WebPrecedenceEdge> arrows { get; init; }
    }

    private static readonly JsonSchema _routesSchema = JsonSchema.FromType<RoutesQuery>();

    [HttpGet]
    [Route("routes", Name = "SearchRoutes")]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<List<Route>>> SearchRoutes([FromQuery] RoutesRequest request)
    {
        if (!ValidateQuery<RoutesQuery>(request.query, _routesSchema, out var queryErrors))
        {
            foreach (var error in queryErrors)
            {
                ModelState.AddModelError("query", error);
            }
            return ValidationProblem();
        }

        var q = JsonSerializer.Deserialize<RoutesQuery>(request.query);

        if (!ValidateArrows(q.arrows, q.categories.Count, out var arrowError))
        {
            ModelState.AddModelError("query", arrowError);
            return ValidationProblem();
        }

        WgsPoint s = q.source.AsWgs();
        WgsPoint t = q.target.AsWgs();

        double maxDistance = q.maxDistance.Value;

        if (!ValidateRouteMaxDistance(s, t, maxDistance))
        {
            ModelState.AddModelError("query", "Starting point and destination are too far from each other.");
            return ValidationProblem();
        }

        var arrows = q.arrows
            .Select(p => new PrecedenceEdge(p.fr.Value, p.to.Value)).ToList();

        try
        {
            return await SearchService.GetRoutes(
                _context.EntityIndex, _context.RoutingEngine, s, t, maxDistance, q.categories, arrows);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex.Message);
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }

    #endregion
}
