using System.Threading.Tasks;

namespace SmartWalk.Core.Interfaces;

/// <summary>
/// Nullipotent query handler.
/// </summary>
/// <typeparam name="T">Type of a request.</typeparam>
/// <typeparam name="U">Type of an object returned.</typeparam>
public interface IQueryHandler<T, U>
{
    /// <summary>
    /// Handler method.
    /// </summary>
    /// <param name="query">Query object.</param>
    /// <returns>Response object.</returns>
    Task<U> Handle(T query);
}
