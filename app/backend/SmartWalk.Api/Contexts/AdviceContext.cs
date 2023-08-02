using SmartWalk.Domain.Entities;
using SmartWalk.Domain.Interfaces;

namespace SmartWalk.Api.Context;

public interface IAdviceContext
{
    Bounds Bounds { get; init; }

    IKeywordAdvicer KeywordAdvicer { get; init; }
}

public sealed class AdviceContext : IAdviceContext
{
    public Bounds Bounds { get; init; }

    public IKeywordAdvicer KeywordAdvicer { get; init; }
}
