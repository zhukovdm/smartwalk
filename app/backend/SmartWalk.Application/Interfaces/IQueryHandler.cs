using System.Threading.Tasks;

namespace SmartWalk.Application.Interfaces;
/// <summary>
/// Query-specific handler.
/// </summary>
/// <typeparam name="T">Type of a request.</typeparam>
/// <typeparam name="U">Type of an object returned to the user.</typeparam>
public interface IQueryHandler<T, U>
{
    /// <summary>
    /// Handler method.
    /// </summary>
    /// <param name="query">Query object.</param>
    /// <returns>Query response object.</returns>
    Task<U> Handle(T query);
}
