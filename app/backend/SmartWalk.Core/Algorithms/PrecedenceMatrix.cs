using System.Collections.Generic;
using System.Linq;
using SmartWalk.Model.Entities;
using SmartWalk.Model.Interfaces;

public sealed class ListPrecedenceMatrix : IPrecedenceMatrix
{
    private static List<List<bool>> GetEmpty(int order)
        => Enumerable.Range(0, order).Select((_) => Enumerable.Repeat(false, order).ToList()).ToList();

    public static List<List<bool>> GetLists(IEnumerable<PrecedenceEdge> edges, int order)
    {
        var matrix = GetEmpty(order);

        foreach (var edge in edges)
        {
            matrix[edge.fr][edge.to] = true;
        }
        return matrix;
    }

    private readonly List<List<bool>> _matrix;

    public int CsCount => _matrix.Count;

    public bool HasArrows { get; private set; }

    public bool IsBefore(int fr, int to) => (_matrix[fr][to]);

    public ListPrecedenceMatrix(List<List<bool>> matrix, bool hasArrows)
    {
        _matrix = matrix; HasArrows = hasArrows;
    }
}
