using System;
using System.Collections.Generic;
using SmartWalk.Core.Entities;

namespace SmartWalk.Application.Helpers;

internal sealed class RouteComparer : IComparer<Route>
{
    public static RouteComparer Instance => instance.Value;

    public int Compare(Route l, Route r)
    {
        var ldist = l.path?.distance ?? l.avgDistance;
        var rdist = r.path?.distance ?? r.avgDistance;

        return ldist.CompareTo(rdist);
    }

    private RouteComparer() { }

    private static readonly Lazy<RouteComparer> instance = new(() => new());
}
