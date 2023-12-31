using System.Text.Json;
using SmartWalk.Application.Interfaces;
using SmartWalk.Application.Validators;

namespace SmartWalk.Application.Parsers;

/// <summary>
/// Standard parser for search `query` strings.
/// </summary>
/// <typeparam name="V">Validation type.</typeparam>
/// <typeparam name="D">Deserialization type.</typeparam>
public abstract class QueryParserBase<V, D> : IQueryParser<V, D>
{
    protected readonly IValidationResult result;

    public QueryParserBase(IValidationResult result) { this.result = result; }

    /// <summary>
    /// Additional domain-specific validation (e.g. arrow configuration).
    /// </summary>
    /// <param name="queryObject">Query object.</param>
    /// <returns></returns>
    protected abstract bool PostValidate(D queryObject);

    /// <summary>
    /// Parse procedure with domain-specific logic.
    /// </summary>
    /// <param name="query">Query string.</param>
    /// <param name="queryObject">Query object.</param>
    /// <returns>True if parsed and passed by a domain-specific validator.</returns>
    public bool TryParse(string query, out D queryObject)
    {
        queryObject = default(D);

        if (!SerializationValidator<V>.Validate(query, out var errors))
        {
            foreach (var error in errors)
            {
                result.AddError("query", error);
            }
            return false;
        }
        queryObject = JsonSerializer.Deserialize<D>(query);
        return PostValidate(queryObject);
    }
}
