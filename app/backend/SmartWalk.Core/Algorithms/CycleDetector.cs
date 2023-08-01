using System.Collections.Generic;
using System.Linq;

namespace SmartWalk.Core.Algorithms;

/// <summary>
/// Detect a cycle in a <b>directed</b> graph using standard 3-color recursive
/// procedure.
/// </summary>
public sealed class CycleDetector
{
    private enum Color { A, B, C }

    private class Vertex
    {
        public Color Color;
        public int Predecessor;
        public Vertex() { Predecessor = -1; Color = Color.A; }
    }

    private int _cycleRef = -1;
    private readonly List<Vertex> _Vs;
    private readonly List<SortedSet<int>> _Es;

    private bool cycle(int u)
    {
        _Vs[u].Color = Color.B;

        foreach (var v in _Es[u])
        {
            _Vs[v].Predecessor = u;
            switch (_Vs[v].Color)
            {
                case Color.A:
                    if (cycle(v)) { return true; }
                    break;
                case Color.B:
                    _cycleRef = v;
                    return true;
            }
        }

        _Vs[u].Color = Color.C;
        return false;
    }

    public CycleDetector(int order)
    {
        _Vs = Enumerable.Range(0, order).Select(_ => new Vertex()).ToList();
        _Es = Enumerable.Range(0, order).Select(_ => new SortedSet<int>()).ToList();
    }

    /// <summary>
    /// Loops are recognized as cycles.
    /// </summary>
    public CycleDetector AddEdge(int fr, int to) { _ = _Es[fr].Add(to); return this; }

    public List<int> Cycle()
    {
        var res = new List<int>();

        for (int u = 0; u < _Vs.Count; ++u)
        {
            if (_Vs[u].Color == Color.A && cycle(u)) { break; }
        }

        if (_cycleRef > -1)
        {
            var cur = _cycleRef;
            do
            {
                res.Add(cur);
                cur = _Vs[cur].Predecessor;
            } while (cur != _cycleRef);
            res.Add(cur);
        }

        res.Reverse();

        return res.Count > 0 ? res : null;
    }
}
