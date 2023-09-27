using System.Threading.Tasks;
using SmartWalk.Model.Entities;
using SmartWalk.Model.Interfaces;

namespace SmartWalk.Service;

public static class PlacesService
{
    public static Task<ExtendedPlace> GetPlace(IEntityStore store, string smartId)
        => store.GetPlace(smartId);
}
