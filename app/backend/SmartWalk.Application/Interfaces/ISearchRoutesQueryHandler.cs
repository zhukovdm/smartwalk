using System.Collections.Generic;
using SmartWalk.Core.Entities;

namespace SmartWalk.Application.Interfaces;

public interface ISearchRoutesQueryHandler : IQueryHandler<SearchRoutesQuery, List<Route>> { }
