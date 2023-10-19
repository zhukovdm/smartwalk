using SmartWalk.Application.Entities;
using SmartWalk.Application.Interfaces;

namespace SmartWalk.Application.Parsers;

/// <summary>
/// Parser specific for /search/direcs requests.
/// </summary>
public class SearchDirecsQueryParser : QueryParserBase<ConstrainedSearchDirecsQuery, SearchDirecsQuery>
{
    public SearchDirecsQueryParser(IValidationResult result) : base(result) { }

    protected override bool PostValidate(SearchDirecsQuery _) => true;
}
