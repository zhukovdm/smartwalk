using System.Threading.Tasks;

namespace SmartWalk.Application.Interfaces;

/// <summary></summary>
/// <typeparam name="T">Type of a request.</typeparam>
/// <typeparam name="U">Type of an object returned to the user.</typeparam>
public interface IQueryHandler<T, U>
{
    Task<U> Handle(T query);
}
