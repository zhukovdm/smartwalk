using SmartWalk.Core.Interfaces;

namespace SmartWalk.Application.Interfaces;

/// <summary>
/// Calculation context used by `Advice` controllers and handlers.
/// </summary>
public interface IAdviceContext
{
    /// <summary>
    /// Abstraction for facilitating autocomplete functionality.
    /// </summary>
    IKeywordAdvicer KeywordAdvicer { get; init; }
}
