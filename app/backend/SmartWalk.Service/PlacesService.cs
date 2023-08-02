using System.Threading.Tasks;
using SmartWalk.Domain.Entities;
using SmartWalk.Domain.Interfaces;

namespace SmartWalk.Service;

public static class PlacesService
{
    public static Task<ExtendedPlace> GetPlace(IEntityStore store, string smartId)
        => store.GetPlace(smartId);
}
