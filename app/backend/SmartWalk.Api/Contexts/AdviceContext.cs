using SmartWalk.Domain.Interfaces;

namespace SmartWalk.Api.Contexts;

public interface IAdviceContext
{
    IKeywordsAdvicer KeywordsAdvicer { get; init; }
}

public sealed class AdviceContext : IAdviceContext
{
    public IKeywordsAdvicer KeywordsAdvicer { get; init; }
}
