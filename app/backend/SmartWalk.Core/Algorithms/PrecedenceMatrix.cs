using System.Collections.Generic;
using SmartWalk.Domain.Interfaces;

public sealed class ListPrecedenceMatrix : IPrecedenceMatrix
{
    private readonly List<List<bool>> _matrix;

    public ListPrecedenceMatrix(List<List<bool>> matrix, int esCount)
    {
        _matrix = matrix; EsCount = esCount;
    }

    public int CsCount => _matrix.Count;

    public int EsCount { get; }

    public bool IsBefore(int l, int r)
    {
        if (l < 0 /* source before any */ || r >= CsCount /* any before target */)
        {
            return true;
        }

        if (l >= CsCount /* no after target */ || r < 0 /* no before source */)
        {
            return false;
        }

        return _matrix[l][r];
    }
}
