using System.Collections.Generic;
using System.Linq;
using SmartWalk.Domain.Entities;

public sealed class TransitiveClosure
{
    private readonly int _ord;
    private readonly List<List<bool>> _mtx;

    public TransitiveClosure(int order, List<PrecedenceEdge> precedence)
    {
        _ord = order;
        _mtx = Enumerable.Range(0, _ord).Select(_ => Enumerable.Repeat(false, _ord).ToList()).ToList();

        foreach (var edge in precedence) { _mtx[edge.fr][edge.to] = true; }
    }

    public List<List<bool>> Closure()
    {
        for (int k = 0; k < _ord; ++k)
        {
            for (int i = 0; i < _ord; ++i)
            {
                for (int j = 0; j < _ord; ++j)
                {
                    _mtx[i][j] = _mtx[i][j] || (_mtx[i][k] && _mtx[k][j]);
                }
            }
        }
        return _mtx;
    }
}
