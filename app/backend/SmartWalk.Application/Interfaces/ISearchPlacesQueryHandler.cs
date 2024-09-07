using System.Collections.Generic;
using SmartWalk.Application.Entities;
using SmartWalk.Application.Interfaces;
using SmartWalk.Core.Entities;

public interface ISearchPlacesQueryHandler : IQueryHandler<SearchPlacesQuery, List<Place>> { }
