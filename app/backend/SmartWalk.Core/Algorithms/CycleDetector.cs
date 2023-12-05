using System.Collections.Generic;
using System.Linq;

namespace SmartWalk.Core.Algorithms;

public sealed class CycleDetector
{
    private enum Color { A, B, C }

    private class Vertex
    {
        public Color Color;
        public int Predecessor;
        public Vertex() { Color = Color.A; Predecessor = -1; }
    }

    private int cycleRef = -1;
    private readonly List<Vertex> Vs;
    private readonly List<SortedSet<int>> Es;

    private bool CycleImpl(int u)
    {
        Vs[u].Color = Color.B;

        foreach (var v in Es[u])
        {
            Vs[v].Predecessor = u;
            switch (Vs[v].Color)
            {
                case Color.A:
                    if (CycleImpl(v)) { return true; }
                    break;
                case Color.B:
                    cycleRef = v;
                    return true;
            }
        }

        Vs[u].Color = Color.C;
        return false;
    }

    public CycleDetector(int order)
    {
        Vs = Enumerable.Range(0, order).Select(_ => new Vertex()).ToList();
        Es = Enumerable.Range(0, order).Select(_ => new SortedSet<int>()).ToList();
    }

    /// <summary>
    /// Add directed edge (fr -> to), repeated edges are allowed.
    /// </summary>
    public CycleDetector AddEdge(int fr, int to) { _ = Es[fr].Add(to); return this; }

    /// <summary>
    /// Detect a cycle in a directed graph using standard 3-color recursive
    /// procedure. Note that loops are recognized as cycles.
    /// </summary>
    public List<int> Cycle()
    {
        var res = new List<int>();

        for (int u = 0; u < Vs.Count; ++u)
        {
            if (Vs[u].Color == Color.A && CycleImpl(u)) { break; }
        }

        if (cycleRef > -1)
        {
            var cur = cycleRef;
            do
            {
                res.Add(cur);
                cur = Vs[cur].Predecessor;
            } while (cur != cycleRef);
            res.Add(cur);
        }

        res.Reverse();

        return res.Count > 0 ? res : null;
    }
}
