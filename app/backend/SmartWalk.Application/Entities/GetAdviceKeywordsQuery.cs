namespace SmartWalk.Application.Entities;

/// <summary>
/// Type used for query handling.
/// </summary>
public sealed class GetAdviceKeywordsQuery
{
    public string prefix { get; init; }

    public int count { get; init; }
}
