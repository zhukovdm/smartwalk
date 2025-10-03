using System.Collections.Generic;
using SmartWalk.Application.Entities;
using SmartWalk.Core.Entities;
using SmartWalk.Core.Interfaces;

namespace SmartWalk.Application.Interfaces;

public interface ISearchDirecsQueryHandler : IQueryHandler<SearchDirecsQuery, List<ShortestPath>> { }
