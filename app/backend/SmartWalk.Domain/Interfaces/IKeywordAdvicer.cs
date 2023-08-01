using System.Collections.Generic;
using System.Threading.Tasks;
using SmartWalk.Domain.Entities;

namespace SmartWalk.Domain.Interfaces;

public interface IKeywordAdvicer
{
    Task<List<KeywordObject>> GetKeywords(string prefix, int count);
}
