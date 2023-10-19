namespace SmartWalk.Application.Interfaces;

/// <summary></summary>
/// <typeparam name="V">Validate against.</typeparam>
/// <typeparam name="D">Deserialize as.</typeparam>
public interface IQueryParser<V, D>
{
    bool TryParse(string query, out D queryObject);
}
