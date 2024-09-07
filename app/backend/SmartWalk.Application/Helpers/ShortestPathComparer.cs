using System;
using System.Collections.Generic;
using SmartWalk.Core.Entities;

namespace SmartWalk.Application.Helpers;

internal sealed class ShortestPathComparer : IComparer<ShortestPath>
{
    public static ShortestPathComparer Instance { get { return instance.Value; } }

    public int Compare(ShortestPath l, ShortestPath r)
    {
        return l.distance.CompareTo(r.distance);
    }

    private ShortestPathComparer() { }

    private static readonly Lazy<ShortestPathComparer> instance = new(() => new());
}
