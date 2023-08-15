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

    public bool IsBefore(int l, int r) => _matrix[l][r];
}
