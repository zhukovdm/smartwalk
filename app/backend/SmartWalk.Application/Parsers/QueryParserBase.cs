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
    /// <summary>
    /// Additional domain-specific validation (e.g. arrow configuration).
    /// </summary>
    /// <param name="parseErrors">Errors occured during validation.</param>
    /// <param name="queryObject">Query object.</param>
    /// <returns></returns>
    protected abstract bool PostValidate(IErrors parseErrors, D queryObject);

    /// <summary>
    /// Parse procedure with domain-specific logic.
    /// </summary>
    /// <param name="parseErrors">Errors occured during parsing.</param>
    /// <param name="query">Query string.</param>
    /// <param name="queryObject">Query object.</param>
    /// <returns>True if parsed and passed by a domain-specific validator.</returns>
    public bool TryParse(IErrors parseErrors, string query, out D queryObject)
    {
        queryObject = default;

        if (!SerializationValidator<V>.Validate(query, out var errors))
        {
            foreach (var error in errors)
            {
                parseErrors.Add("query", error);
            }
            return false;
        }
        queryObject = JsonSerializer.Deserialize<D>(query);
        return PostValidate(parseErrors, queryObject);
    }
}
