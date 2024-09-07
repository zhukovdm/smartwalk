using System;
using System.Collections.Generic;
using SmartWalk.Core.Entities;

namespace SmartWalk.Application.Helpers;

internal sealed class RouteComparer : IComparer<Route>
{
    public static RouteComparer Instance { get { return instance.Value; } }

    public int Compare(Route l, Route r)
    {
        return ShortestPathComparer.Instance.Compare(l.path, r.path);
    }

    private RouteComparer() { }

    private static readonly Lazy<RouteComparer> instance = new(() => new());
}
