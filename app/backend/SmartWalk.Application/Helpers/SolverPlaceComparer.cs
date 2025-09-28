using System;
using System.Collections.Generic;
using SmartWalk.Core.Entities;

namespace SmartWalk.Application.Helpers;

internal sealed class SolverPlaceComparer : IComparer<SolverPlace>
{
    public static SolverPlaceComparer Instance => instance.Value;

    public int Compare(SolverPlace l, SolverPlace r)
    {
        return (l.idx != r.idx) ? l.idx.CompareTo(r.idx) : l.cat.CompareTo(r.cat);
    }

    private SolverPlaceComparer() { }

    private static readonly Lazy<SolverPlaceComparer> instance = new(() => new());
}
