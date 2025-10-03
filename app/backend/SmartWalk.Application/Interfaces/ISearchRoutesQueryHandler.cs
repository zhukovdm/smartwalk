using System.Collections.Generic;
using SmartWalk.Core.Entities;
using SmartWalk.Core.Interfaces;

namespace SmartWalk.Application.Interfaces;

public interface ISearchRoutesQueryHandler : IQueryHandler<SearchRoutesQuery, List<Route>> { }
