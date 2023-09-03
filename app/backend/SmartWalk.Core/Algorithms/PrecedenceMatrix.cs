using System.Collections.Generic;
using System.Linq;
using SmartWalk.Domain.Entities;
using SmartWalk.Domain.Interfaces;

public sealed class ListPrecedenceMatrix : IPrecedenceMatrix
{
    private static List<List<bool>> GetEmpty(int order)
        => Enumerable.Range(0, order).Select(_ => Enumerable.Repeat(false, order).ToList()).ToList();

    public static List<List<bool>> GetPrecedence(IEnumerable<PrecedenceEdge> precedence, int order)
    {
        var matrix = GetEmpty(order);
        foreach (var edge in precedence) { matrix[edge.fr][edge.to] = true; }

        return matrix;
    }

    private readonly List<List<bool>> _matrix;
    private readonly int _sourceCat;
    private readonly int _targetCat;

    public int CsCount => _matrix.Count;

    public int EsCount { get; }

    public ListPrecedenceMatrix(List<List<bool>> matrix, int esCount, int sourceCat, int targetCat)
    {
        _matrix = matrix; EsCount = esCount; _sourceCat = sourceCat; _targetCat = targetCat;
    }

    public bool IsBefore(int fr, int to)
    {
        // (implicit) source before any, any before target

        if (fr == _sourceCat || to == _targetCat)
        {
            return true;
        }

        // (implicit) no after target, no before source

        if (fr == _targetCat || to == _sourceCat)
        {
            return false;
        }

        return _matrix[fr][to];
    }
}
