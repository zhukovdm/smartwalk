using SmartWalk.Domain.Entities;
using SmartWalk.Domain.Interfaces;

namespace SmartWalk.Api.Contexts;

public interface IAdviceContext
{
    BoundsAdvice BoundsAdvice { get; init; }

    IKeywordsAdvicer KeywordsAdvicer { get; init; }
}

public sealed class AdviceContext : IAdviceContext
{
    public BoundsAdvice BoundsAdvice { get; init; }

    public IKeywordsAdvicer KeywordsAdvicer { get; init; }
}
