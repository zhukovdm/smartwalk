using System.Collections.Generic;
using System.Threading.Tasks;
using SmartWalk.Core.Entities;

namespace SmartWalk.Core.Interfaces;

public interface IKeywordAdvicer
{
    /// <summary>
    /// Get top-k items with the highest score (or relevancy) by prefix.
    /// </summary>
    /// <param name="prefix">All retrieved items shall share the same prefix.</param>
    /// <param name="count">Upper bound on the number of retrieved items.</param>
    Task<List<KeywordAdviceItem>> GetTopK(string prefix, int count);
}
