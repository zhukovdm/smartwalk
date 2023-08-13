using System.Collections.Generic;
using System.Threading.Tasks;
using SmartWalk.Domain.Entities;

namespace SmartWalk.Domain.Interfaces;

public interface IKeywordsAdvicer
{
    Task<List<KeywordsAdviceItem>> GetTopK(string prefix, int count);
}
