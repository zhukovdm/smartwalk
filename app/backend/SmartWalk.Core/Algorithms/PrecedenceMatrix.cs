using System.Collections.Generic;
using System.Linq;
using SmartWalk.Domain.Entities;
using SmartWalk.Domain.Interfaces;

public sealed class ListPrecedenceMatrix : IPrecedenceMatrix
{
    private static List<List<bool>> GetEmpty(int order)
        => Enumerable.Range(0, order).Select(_ => Enumerable.Repeat(false, order).ToList()).ToList();

    public static List<List<bool>> GetPrecedence(int order, List<PrecedenceEdge> precedence)
    {
        var matrix = GetEmpty(order);
        foreach (var edge in precedence) { matrix[edge.fr][edge.to] = true; }

        return matrix;
    }

    private readonly List<List<bool>> _matrix;

    public ListPrecedenceMatrix(List<List<bool>> matrix, int esCount)
    {
        _matrix = matrix; EsCount = esCount;
    }

    public int CsCount => _matrix.Count;

    public int EsCount { get; }

    public bool IsBefore(int fr, int to)
    {
        // (implicit) source before any, any before target

        if (fr == (CsCount + 0) || to == (CsCount + 1))
        {
            return true;
        }

        // (implicit) no after target, no before source

        if (fr == (CsCount + 1) || to == (CsCount + 0))
        {
            return false;
        }

        return _matrix[fr][to];
    }
}
