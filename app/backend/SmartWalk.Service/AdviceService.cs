using System.Collections.Generic;
using System.Threading.Tasks;
using SmartWalk.Domain.Entities;
using SmartWalk.Domain.Interfaces;

namespace SmartWalk.Service;

public static class AdviceService
{
    public static Bounds GetBounds(Bounds bounds) => bounds;

    /// <summary>
    /// Get a list of autocomplete items.
    /// </summary>
    /// <param name="prefix">Keywords must have the passed prefix.</param>
    /// <param name="count">Maximum possible number of fetched items.</param>
    public static Task<List<Keyword>> GetKeywordsAsync(IKeywordAdvicer advicer, string prefix, int count)
        => advicer.GetTopK(prefix, count);
}
