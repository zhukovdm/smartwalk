using SmartWalk.Core.Interfaces;

namespace SmartWalk.Application.Interfaces;

/// <summary>
/// Calculation context used by `Advice` controllers and handlers.
/// </summary>
public interface IAdviceContext
{
    IKeywordAdvicer KeywordAdvicer { get; init; }
}
