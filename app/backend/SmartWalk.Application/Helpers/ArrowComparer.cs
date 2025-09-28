using System;
using System.Collections.Generic;
using SmartWalk.Core.Entities;

namespace SmartWalk.Application.Helpers;

internal sealed class ArrowComparer : IComparer<Arrow>
{
    public static ArrowComparer Instance => instance.Value;

    public int Compare(Arrow l, Arrow r)
    {
        return l.fr != r.fr ? l.fr.CompareTo(r.fr) : l.to.CompareTo(r.to);
    }

    private ArrowComparer() { }

    private static readonly Lazy<ArrowComparer> instance = new(() => new());
}
