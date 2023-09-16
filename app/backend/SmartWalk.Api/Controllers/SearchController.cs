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
    private static ValidationProblemDetails GetValidationProblemDetails(string detail)
    {
        return new(new Dictionary<string, string[]>
        {
            { "query", new string[] { detail } }
        });
    }

    private static bool VerifyDistance(WgsPoint source, WgsPoint target, double maxDistance)
        => Spherical.HaversineDistance(source, target) <= maxDistance && maxDistance <= 30_000;

    /// <summary>
    /// Check if edges define directed acyclic loop-free graph, repeated edges
    /// are tolerable.
    /// </summary>
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
        var errors = schema.Validate(query);

        return (errors.Count == 0)
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

        public WgsPoint AsWgs() => new(Spherical.Round(lon.Value), Spherical.Round(lat.Value));
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

    #region SearchDirecs

    public class DirecsRequest
    {
        /// <example>
        ///   {"waypoints":[{"lon":14.4035264,"lat":50.0884344},{"lon":14.4057219,"lat":50.0919964}]}
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
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<List<Direc>>> SearchDirecs([FromQuery] DirecsRequest request)
    {
        DirecsQuery dq = null;

        try
        {
            dq = DeserializeQuery<DirecsQuery>(request.query, _direcsSchema);
        }
        catch (Exception ex) { return BadRequest(GetValidationProblemDetails(ex.Message)); }

        try
        {
            return await SearchService.GetDirecs(
                _context.RoutingEngine, dq.waypoints.Select((p) => p.AsWgs()).ToList());
        }
        catch (Exception ex) { _logger.LogError(ex.Message); return StatusCode(500); }
    }

    #endregion

    #region SearchPlaces

    public sealed class PlacesRequest
    {
        /// <example>
        ///   {"center":{"lon":14.4035264,"lat":50.0884344},"radius":100,"categories":[]}
        /// </example>
        /// <example>
        ///   {"center":{"lon":14.4035264,"lat":50.0884344},"radius":500,"categories":[{"keyword":"museum","filters":{}},{"keyword":"tourism","filters":{}}]}
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
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<List<Place>>> SearchPlaces([FromQuery] PlacesRequest request)
    {
        PlacesQuery pq = null;

        try
        {
            pq = DeserializeQuery<PlacesQuery>(request.query, _placesSchema);
        }
        catch (Exception ex) { return BadRequest(GetValidationProblemDetails(ex.Message)); }

        try
        {
            return await SearchService.GetPlaces(
                _context.EntityIndex, pq.center.AsWgs(), pq.radius.Value, pq.categories);
        }
        catch (Exception ex) { _logger.LogError(ex.Message); return StatusCode(500); }
    }

    #endregion

    #region SearchRoutes

    public sealed class RoutesRequest
    {
        /// <example>
        ///   {"source":{"lon":14.4035264,"lat":50.0884344},"target":{"lon":14.4039444,"lat":50.0894092},"distance":3000,"categories":[{"keyword":"castle","filters":{}},{"keyword":"restaurant","filters":{}},{"keyword":"tourism","filters":{}}],"precedence":[{"fr":0,"to":2}]}
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
        /// Edges of a category precedence graph.
        /// </summary>
        [Required]
        public List<WebPrecedenceEdge> precedence { get; init; }
    }

    private static readonly JsonSchema _routesSchema = JsonSchema.FromType<RoutesQuery>();

    [HttpGet]
    [Route("routes", Name = "SearchRoutes")]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<List<Route>>> SearchRoutes([FromQuery] RoutesRequest request)
    {
        RoutesQuery rq = null;

        WgsPoint s = null;
        WgsPoint t = null;

        try
        {
            rq = DeserializeQuery<RoutesQuery>(request.query, _routesSchema);

            if (!VerifyPrecedence(rq.precedence, rq.categories.Count)) {
                throw new Exception("Malformed precedence graph.");
            }

            s = rq.source.AsWgs();
            t = rq.target.AsWgs();

            if (!VerifyDistance(s, t, rq.maxDistance.Value)) {
                throw new Exception("Malformed point-distance configuration.");
            }
        }
        catch (Exception ex) { return BadRequest(GetValidationProblemDetails(ex.Message)); }

        var precedence = rq.precedence
            .Select(p => new PrecedenceEdge(p.fr.Value, p.to.Value)).ToList();

        try
        {
            return await SearchService.GetRoutes(
                _context.EntityIndex, _context.RoutingEngine, s, t, rq.maxDistance.Value, rq.categories, precedence);
        }
        catch (Exception ex) { _logger.LogError(ex.Message); return StatusCode(500); }
    }

    #endregion
}
