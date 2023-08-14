using System.Collections.Generic;
using System.Threading.Tasks;
using SmartWalk.Domain.Entities;

namespace SmartWalk.Domain.Interfaces;

public interface IGeoIndex
{
    /// <param name="polygon">Bounding polygon</param>
    /// <returns>Network detour ratio typical for the area within a given polygon.</returns>
    Task<double> GetDetourRatio(List<WgsPoint> polygon);
}
