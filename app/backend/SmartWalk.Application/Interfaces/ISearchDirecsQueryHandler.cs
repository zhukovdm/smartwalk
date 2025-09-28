using System.Collections.Generic;
using SmartWalk.Application.Entities;
using SmartWalk.Core.Entities;

namespace SmartWalk.Application.Interfaces;

public interface ISearchDirecsQueryHandler : IQueryHandler<SearchDirecsQuery, List<ShortestPath>> { }
