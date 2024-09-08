using SmartWalk.Application.Entities;
using SmartWalk.Application.Interfaces;

namespace SmartWalk.Application.Parsers;

/// <summary>
/// Parser specific for /search/places requests.
/// </summary>
public sealed class SearchPlacesQueryParser : QueryParserBase<ConstrainedSearchPlacesQuery, SearchPlacesQuery>
{
    protected override bool PostValidate(IErrors parseErrors, SearchPlacesQuery _) => true;
}
