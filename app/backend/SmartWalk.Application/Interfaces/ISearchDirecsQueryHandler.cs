using System.Collections.Generic;
using SmartWalk.Application.Entities;
using SmartWalk.Application.Interfaces;
using SmartWalk.Core.Entities;

public interface ISearchDirecsQueryHandler : IQueryHandler<SearchDirecsQuery, List<ShortestPath>> { }
