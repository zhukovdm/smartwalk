using System.Text.Json;
using SmartWalk.Application.Interfaces;
using SmartWalk.Application.Validators;

namespace SmartWalk.Application.Parsers;

public abstract class QueryParserBase<V, D> : IQueryParser<V, D>
{
    protected readonly IValidationResult _result;

    public QueryParserBase(IValidationResult result) { _result = result; }

    /// <summary>
    /// Additional domain-specific validation (e.g. arrow configuration).
    /// </summary>
    /// <param name="queryObject"></param>
    /// <returns></returns>
    protected abstract bool PostValidate(D queryObject);

    /// <summary>
    /// Parse procedure with domain-specific logic.
    /// </summary>
    /// <param name="query"></param>
    /// <param name="queryObject"></param>
    /// <returns></returns>
    public bool TryParse(string query, out D queryObject)
    {
        queryObject = default(D);

        if (!SerializationValidator<V>.Validate(query, out var errors))
        {
            foreach (var error in errors)
            {
                _result.AddError("query", error);
            }
            return false;
        }
        queryObject = JsonSerializer.Deserialize<D>(query);
        return PostValidate(queryObject);
    }
}
