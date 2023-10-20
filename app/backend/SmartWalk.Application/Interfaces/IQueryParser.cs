namespace SmartWalk.Application.Interfaces;

/// <summary>
/// Query parser and validator.
/// </summary>
/// <typeparam name="V">Validate against.</typeparam>
/// <typeparam name="D">Deserialize as.</typeparam>
public interface IQueryParser<V, D>
{
    /// <summary>
    /// Parse with possible fail.
    /// </summary>
    /// <param name="query">Query string.</param>
    /// <param name="queryObject">Deserialized query object.</param>
    /// <returns>True if parsing has succeeded.</returns>
    bool TryParse(string query, out D queryObject);
}
