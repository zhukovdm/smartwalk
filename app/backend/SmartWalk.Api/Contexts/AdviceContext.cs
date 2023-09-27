using SmartWalk.Model.Interfaces;

namespace SmartWalk.Api.Contexts;

public interface IAdviceContext
{
    IKeywordAdvicer KeywordAdvicer { get; init; }
}

public sealed class AdviceContext : IAdviceContext
{
    public IKeywordAdvicer KeywordAdvicer { get; init; }
}
