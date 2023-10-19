using SmartWalk.Application.Entities;
using SmartWalk.Application.Interfaces;

namespace SmartWalk.Application.Parsers;

/// <summary>
/// Parser specific for /search/places requests.
/// </summary>
public class SearchPlacesQueryParser : QueryParserBase<ConstrainedSearchPlacesQuery, SearchPlacesQuery>
{
    public SearchPlacesQueryParser(IValidationResult result) : base(result) { }

    protected override bool PostValidate(SearchPlacesQuery _) => true;
}
