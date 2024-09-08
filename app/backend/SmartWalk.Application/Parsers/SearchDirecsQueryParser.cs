using SmartWalk.Application.Entities;
using SmartWalk.Application.Interfaces;

namespace SmartWalk.Application.Parsers;

/// <summary>
/// Parser specific for /search/direcs requests.
/// </summary>
public sealed class SearchDirecsQueryParser : QueryParserBase<ConstrainedSearchDirecsQuery, SearchDirecsQuery>
{
    protected override bool PostValidate(IErrors parseErrors, SearchDirecsQuery _) => true;
}
