using System.Collections.Generic;
using SmartWalk.Application.Entities;
using SmartWalk.Core.Entities;

namespace SmartWalk.Application.Interfaces;

public interface ISearchPlacesQueryHandler : IQueryHandler<SearchPlacesQuery, List<Place>> { }
