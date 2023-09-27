using System.Threading.Tasks;
using SmartWalk.Model.Entities;

namespace SmartWalk.Model.Interfaces;

public interface IEntityStore
{
    /// <summary>
    /// Fetch the full representation of a place by Id.
    /// </summary>
    /// <param name="smartId">Id as per stored in the database.</param>
    Task<ExtendedPlace> GetPlace(string smartId);
}
