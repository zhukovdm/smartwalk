using System.Collections.Generic;
using System.Linq;

namespace SmartWalk.Core.Algorithms;

public sealed class CycleDetector
{
    private enum Color
    {
        Unseen,
        Opened,
        Closed
    }

    private sealed class Vertex
    {
        public Color Color;
        public int Predecessor;

        public Vertex()
        {
            Color = Color.Unseen;
            Predecessor = -1;
        }
    }

    private int? cycleRef = null;
    private readonly List<Vertex> Vs;
    private readonly List<SortedSet<int>> Es;

    public CycleDetector(int order)
    {
        Vs = Enumerable.Range(0, order).Select(_ => new Vertex()).ToList();
        Es = Enumerable.Range(0, order).Select(_ => new SortedSet<int>()).ToList();
    }

    /// <summary>
    /// Add directed edge (fr -> to). Repeated edges and loops are allowed.
    /// </summary>
    public CycleDetector AddEdge(int fr, int to) { _ = Es[fr].Add(to); return this; }

    /// <summary>
    /// Detect a cycle in a directed graph using standard 3-color non-recursive
    /// procedure. Note that loops are recognized as cycles.
    /// </summary>
    public List<int> Cycle()
    {
        // traverse graph

        var stk = new Stack<int>();

        for (int u = 0; u < Vs.Count; ++u)
        {
            if (Vs[u].Color == Color.Unseen && cycleRef is null)
            {
                stk.Push(u);
                while (stk.Count != 0 && cycleRef is null)
                {
                    var v = stk.Peek();
                    switch (Vs[v].Color)
                    {
                        case Color.Unseen:
                            Vs[v].Color = Color.Opened;

                            foreach (var w in Es[v])
                            {
                                Vs[w].Predecessor = v;
                                switch (Vs[w].Color)
                                {
                                    case Color.Unseen:
                                        stk.Push(w);
                                        break;

                                    case Color.Opened: // cycle detected
                                        cycleRef = w;
                                        break;

                                    case Color.Closed: // do nothing
                                        break;
                                }
                            }
                            break;

                        case Color.Opened:
                            Vs[v].Color = Color.Closed;
                            stk.Pop();
                            break;

                        case Color.Closed:
                            stk.Pop();
                            break;
                    }
                }
            }
        }

        // construct cycle

        var res = new List<int>();

        if (cycleRef is not null)
        {
            var cur = cycleRef.Value;
            do
            {
                res.Add(cur);
                cur = Vs[cur].Predecessor;
            } while (cur != cycleRef);
            res.Add(cur);
        }
        res.Reverse();

        return (res.Count > 0) ? res : null;
    }
}
