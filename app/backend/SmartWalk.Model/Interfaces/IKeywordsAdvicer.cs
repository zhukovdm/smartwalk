using System.Collections.Generic;
using System.Threading.Tasks;
using SmartWalk.Model.Entities;

namespace SmartWalk.Model.Interfaces;

public interface IKeywordAdvicer
{
    Task<List<KeywordAdviceItem>> GetTopK(string prefix, int count);
}
