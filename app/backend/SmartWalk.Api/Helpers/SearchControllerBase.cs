using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SmartWalk.Application.Interfaces;

namespace SmartWalk.Api.Helpers;

public abstract class SearchControllerBase : ControllerBase
{
    private readonly IErrors parseErrors;

    private readonly ILogger logger;

    public SearchControllerBase(ILogger logger)
    {
        parseErrors = new ModelStateWrapper(ModelState); this.logger = logger;
    }

    /// <summary>Concrete handling</summary>
    /// <remarks>
    /// Note that validation and deserialization types are different, V is
    /// reacher than D and used for validation. The reason is that standard
    /// library System.Text.Json supports attributes only partially.
    /// </remarks>
    /// <typeparam name="V">Validate against type V</typeparam>
    /// <typeparam name="D">Deserialize as type D</typeparam>
    /// <typeparam name="T">Response of a handler</typeparam>
    /// <param name="query">Received query string</param>
    /// <param name="parser">Constructor of a parser with validation capabilities.</param>
    /// <param name="handler">Request handler.</param>
    /// <returns>Response object.</returns>
    protected async Task<ActionResult<T>> SearchT<V, D, T>(
        string query, IQueryParser<V, D> parser, IQueryHandler<D, T> handler)
    {
        var responder = new SearchResponder<T>();

        if (!parser.TryParse(parseErrors, query, out var queryObject))
        {
            return responder.Invalid(this);
        }

        try
        {
            var result = await handler.Handle(queryObject);

            return responder.Respond(result);
        }
        catch (Exception ex)
        {
            logger.LogError("{Error}", ex.Message);
            return responder.Failure();
        }
    }
}
