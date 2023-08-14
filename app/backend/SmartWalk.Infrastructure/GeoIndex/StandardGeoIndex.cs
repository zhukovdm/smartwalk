using System.Collections.Generic;
using System.Threading.Tasks;
using SmartWalk.Domain.Entities;
using SmartWalk.Domain.Interfaces;

namespace SmartWalk.Infrastructure.GeoIndex;

internal class StandardGeoIndex : IGeoIndex
{
    public Task<double> GetDetourRatio(List<WgsPoint> polygon)
        => Task.FromResult(1.25);
}
