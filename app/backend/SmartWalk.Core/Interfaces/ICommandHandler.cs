using System.Threading.Tasks;

namespace SmartWalk.Application.Interfaces;

/// <summary>
/// Command handler with side effects.
/// </summary>
/// <typeparam name="T">Type of a request.</typeparam>
/// <typeparam name="U">Type of an object returned.</typeparam>
public interface ICommandHandler<T, U>
{
    /// <summary>
    /// Handler method.
    /// </summary>
    /// <param name="command">Command object.</param>
    /// <returns>Response object.</returns>
    Task<U> Handle(T command);
}
