using System.Collections.Generic;
using SmartWalk.Application.Interfaces;
using SmartWalk.Core.Entities;

public interface ISearchRoutesQueryHandler : IQueryHandler<SearchRoutesQuery, List<Route>> { }
