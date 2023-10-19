using SmartWalk.Application.Interfaces;
using SmartWalk.Core.Interfaces;

namespace SmartWalk.Application.Entities;

public sealed class AdviceContext : IAdviceContext
{
    public IKeywordAdvicer KeywordAdvicer { get; init; }
}
