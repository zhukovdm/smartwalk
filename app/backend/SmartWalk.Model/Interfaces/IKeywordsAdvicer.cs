using System.Collections.Generic;
using System.Threading.Tasks;
using SmartWalk.Model.Entities;

namespace SmartWalk.Model.Interfaces;

public interface IKeywordsAdvicer
{
    Task<List<KeywordsAdviceItem>> GetTopK(string prefix, int count);
}
