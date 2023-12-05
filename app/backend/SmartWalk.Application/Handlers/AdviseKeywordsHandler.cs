using System.Collections.Generic;
using System.Threading.Tasks;
using SmartWalk.Application.Entities;
using SmartWalk.Application.Interfaces;
using SmartWalk.Core.Entities;
using SmartWalk.Core.Interfaces;

namespace SmartWalk.Application.Handlers;

/// <summary>
/// Endpoint-specific handler.
/// </summary>
public sealed class AdviseKeywordsHandler : IQueryHandler<AdviseKeywordsQuery, List<KeywordAdviceItem>>
{
    private readonly IKeywordAdvicer advicer;

    public AdviseKeywordsHandler(IKeywordAdvicer advicer) { this.advicer = advicer; }

    /// <summary>
    /// Get a list of autocomplete items.
    /// </summary>
    public Task<List<KeywordAdviceItem>> Handle(AdviseKeywordsQuery query)
    {
        return advicer.GetTopK(query.prefix, query.count);
    }
}
