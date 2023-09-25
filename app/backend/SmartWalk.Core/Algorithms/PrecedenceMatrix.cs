using System.Collections.Generic;
using System.Linq;
using SmartWalk.Domain.Entities;
using SmartWalk.Domain.Interfaces;

public sealed class ListPrecedenceMatrix : IPrecedenceMatrix
{
    private static List<List<bool>> GetEmpty(int order)
        => Enumerable.Range(0, order).Select(_ => Enumerable.Repeat(false, order).ToList()).ToList();

    public static List<List<bool>> GetLists(IEnumerable<PrecedenceEdge> precedence, int order)
    {
        var matrix = GetEmpty(order);

        foreach (var edge in precedence)
        {
            matrix[edge.fr][edge.to] = true;
        }
        return matrix;
    }

    private readonly bool _hasEdges;
    private readonly List<List<bool>> _matrix;

    /// <param name="hasNonTerminalEdges">
    /// Set <c>true</c> if the matrix has at least one edge with both vertices
    /// different from the source and target.
    /// </param>
    public ListPrecedenceMatrix(List<List<bool>> matrix, bool hasNonTerminalEdges)
    {
        _matrix = matrix; _hasEdges = hasNonTerminalEdges;
    }

    public int CsCount => _matrix.Count;

    public bool IsEmpty() => (!_hasEdges);

    public bool IsBefore(int fr, int to) => (_matrix[fr][to]);
}
