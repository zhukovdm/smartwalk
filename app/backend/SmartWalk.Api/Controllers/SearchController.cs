using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using SmartWalk.Api.Contexts;
using SmartWalk.Core.Algorithms;
using SmartWalk.Domain.Entities;
using SmartWalk.Service;

namespace SmartWalk.Api.Controllers;

[ApiController]
[Route("api/search")]
public sealed class SearchController : ControllerBase
{
    private readonly ISearchContext _context;
    private readonly ILogger<SearchController> _logger;

    private class MalformedQueryException : Exception
    {
        private static string GetMessage(string property) => $"Malformed property '{property}' detected.";

        public MalformedQueryException() { }

        public MalformedQueryException(string property) : base(GetMessage(property)) { }

        public MalformedQueryException(string property, Exception inner) : base(GetMessage(property), inner) { }
    }

    private static void Error(string property)
        => throw new MalformedQueryException(property);

    private static ProblemDetails GetProblemDetails(int status, string detail)
    {
        return new() { Status = status, Detail = detail };
    }

    private static bool VerifyCategory(Category category)
    {
        var err = false;
        var num = category.filters.numerics;

        foreach (var n in new[] { num.capacity, num.elevation, num.minimumAge, num.rating, num.year })
        {
            err |= n is not null && n.max < n.min;
        }
        return !err;
    }

    private static bool VerifyCategories(List<Category> categories)
    {
        return categories.Aggregate(true, (acc, category) => acc && VerifyCategory(category));
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

    private static T DeserializeQuery<T>(string query)
    {
        var res = JsonConvert.DeserializeObject<T>(query);
        return res is not null ? res : throw new ArgumentOutOfRangeException(nameof(query));
    }

    /// <summary>
    /// Representation of a point in EPSG:4326 restricted to the range of EPSG:3857.
    /// See https://epsg.io/4326 and https://epsg.io/3857 for details.
    /// </summary>
    private sealed class WebPoint
    {
        [JsonProperty(Required = Required.Always)]
        public double? lon { get; }

        [JsonProperty(Required = Required.Always)]
        public double? lat { get; }

        public WebPoint(double? lon, double? lat)
        {
            if (lon < -180.0 || lon > +180.0)
            {
                Error(nameof(lon));
            }
            if (lat < -85.06 || lat > +85.06)
            {
                Error(nameof(lat));
            }

            this.lon = lon;
            this.lat = lat;
        }

        public WgsPoint AsWgs() => new(lon.Value, lat.Value);
    }

    private sealed class WebPrecedenceEdge
    {
        [JsonProperty(Required = Required.Always)]
        public int? fr { get; set; }

        [JsonProperty(Required = Required.Always)]
        public int? to { get; set; }

        public WebPrecedenceEdge(int? fr, int? to)
        {
            if (fr < 0)
            {
                Error(nameof(fr));
            }
            if (to < 0)
            {
                Error(nameof(to));
            }

            this.fr = fr;
            this.to = to;
        }
    }

    private sealed class PlacesQuery
    {
        [JsonProperty(Required = Required.Always)]
        public WebPoint center { get; }

        /// <summary>
        /// Radius around the center (in meters).
        /// </summary>
        [JsonProperty(Required = Required.Always)]
        public double? radius { get; }

        [JsonProperty(Required = Required.Always)]
        public List<Category> categories { get; }

        [JsonProperty(Required = Required.Always)]
        public int? offset { get; }

        [JsonProperty(Required = Required.Always)]
        public int? bucket { get; }

        public PlacesQuery(WebPoint center, double? radius, List<Category> categories, int? offset, int? bucket)
        {
            if (radius < 0 || radius > 12_000)
            {
                Error(nameof(radius));
            }
            if (!VerifyCategories(categories))
            {
                Error(nameof(categories));
            }
            if (offset < 0)
            {
                Error(nameof(offset));
            }
            if (bucket < 0)
            {
                Error(nameof(bucket));
            }

            this.center = center;
            this.radius = radius;
            this.categories = categories;
            this.offset = offset;
            this.bucket = bucket;
        }
    }

    public SearchController(ISearchContext context, ILogger<SearchController> logger)
    {
        _context = context; _logger = logger;
    }

    [HttpGet]
    [Route("places", Name = "SearchPlaces")]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<List<Place>>> SearchPlaces(string query)
    {
        PlacesQuery pq = null;

        try
        {
            pq = DeserializeQuery<PlacesQuery>(query);
        }
        catch (Exception ex) { return BadRequest(GetProblemDetails(400, ex.Message)); }

        try
        {
            return await SearchService.GetPlaces(
                _context.Index, pq.center.AsWgs(), pq.radius.Value, pq.categories, pq.offset.Value, pq.bucket.Value);
        }
        catch (Exception ex) { _logger.LogError(ex.Message); return StatusCode(500); }
    }

    private sealed class DirecsQuery
    {
        [JsonProperty(Required = Required.Always)]
        public List<WebPoint> waypoints { get; }

        public DirecsQuery(List<WebPoint> waypoints)
        {
            if (waypoints.Count < 2)
            {
                Error(nameof(waypoints));
            }

            this.waypoints = waypoints;
        }
    }

    [HttpGet]
    [Route("direcs", Name = "SearchDirecs")]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<List<ShortestPath>>> SearchDirecs(string query)
    {
        DirecsQuery dq = null;

        try
        {
            dq = DeserializeQuery<DirecsQuery>(query);
        }
        catch (Exception ex) { return BadRequest(GetProblemDetails(400, ex.Message)); }

        try
        {
            return await SearchService.GetDirecs(_context.Engine, dq.waypoints.Select((p) => p.AsWgs()).ToList());
        }
        catch (Exception ex) { _logger.LogError(ex.Message); return StatusCode(500); }
    }

    private sealed class RoutesQuery
    {
        [JsonProperty(Required = Required.Always)]
        public WebPoint source { get; set; }

        [JsonProperty(Required = Required.Always)]
        public WebPoint target { get; set; }

        /// <summary>
        /// Maximum walking distance in <b>meters</b>.
        /// </summary>
        [JsonProperty(Required = Required.Always)]
        public double? distance { get; set; }

        [JsonProperty(Required = Required.Always)]
        public List<Category> categories { get; set; }

        [JsonProperty(Required = Required.Always)]
        public List<WebPrecedenceEdge> precedence { get; set; }

        public RoutesQuery(WebPoint source, WebPoint target, double? distance, List<Category> categories, List<WebPrecedenceEdge> precedence)
        {
            if (distance < 0 || distance > 30_000)
            {
                Error(nameof(distance));
            }
            if (!VerifyCategories(categories))
            {
                Error(nameof(categories));
            }
            if (!VerifyPrecedence(precedence, categories.Count))
            {
                Error(nameof(precedence));
            }

            this.source = source;
            this.target = target;
            this.distance = distance;
            this.categories = categories;
            this.precedence = precedence;
        }
    }

    [HttpGet]
    [Route("routes", Name = "SearchRoutes")]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<List<Route>>> SearchRoutes(string query)
    {
        RoutesQuery rq = null;

        try
        {
            rq = DeserializeQuery<RoutesQuery>(query);
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
