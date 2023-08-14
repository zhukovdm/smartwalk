using SmartWalk.Domain.Interfaces;

namespace SmartWalk.Infrastructure.GeoIndex;

public static class GeoIndexFactory
{
    public static IGeoIndex GetInstance() => StandardGeoIndex.GetInstance();
}
