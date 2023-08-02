using System.Collections.Generic;
using System.Linq;
using SmartWalk.Core.Entities;

namespace SmartWalk.Core.Solvers;

public class SolverBase
{
    protected SolverBase() { }

    protected static List<SolverPlace> FilterPlaces(List<SolverPlace> places, SortedSet<int> occur)
        => places.Where(place => !occur.Contains(place.Index)).ToList();
}
