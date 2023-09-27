using System.Collections.Generic;
using System.Threading.Tasks;
using SmartWalk.Model.Entities;
using SmartWalk.Model.Interfaces;

namespace SmartWalk.Service;

public static class AdviceService
{
    /// <summary>
    /// Get a list of autocomplete items.
    /// </summary>
    /// <param name="prefix">Keywords must have the passed prefix.</param>
    /// <param name="count">Maximum possible number of fetched items.</param>
    public static Task<List<KeywordAdviceItem>> GetKeywords(IKeywordAdvicer advicer, string prefix, int count)
        => advicer.GetTopK(prefix, count);
}
