using System.Threading.Tasks;
using SmartWalk.Domain.Entities;

namespace SmartWalk.Domain.Interfaces;

public interface IEntityStore
{
    /// <summary>
    /// Fetch the full representation of a place by Id.
    /// </summary>
    /// <param name="smartId">Id as per stored in the database.</param>
    public Task<ExtendedPlace> GetPlace(string smartId);
}
