namespace SmartWalk.Application.Interfaces;

/// <summary>
/// Query parser and validator.
/// </summary>
/// <typeparam name="V">Validate against.</typeparam>
/// <typeparam name="D">Deserialize as.</typeparam>
public interface IQueryParser<V, D>
{
    /// <summary>
    /// Parsing with possible fail.
    /// </summary>
    /// <param name="parseErrors">Reasons for parsing failures</param>
    /// <param name="query">Query string</param>
    /// <param name="queryObject">Deserialized query object</param>
    /// <returns>True if parsing has succeeded, and False otherwise</returns>
    bool TryParse(IErrors parseErrors, string query, out D queryObject);
}
