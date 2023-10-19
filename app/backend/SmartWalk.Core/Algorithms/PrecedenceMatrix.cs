using System.Collections.Generic;
using System.Linq;
using SmartWalk.Core.Entities;
using SmartWalk.Core.Interfaces;

namespace SmartWalk.Core.Algorithms;

/// <summary>
/// List-based precedence matrix defining an order on a set of categories.
/// </summary>
public sealed class ListPrecedenceMatrix : IPrecedenceMatrix
{
    /// <summary></summary>
    /// <param name="order"></param>
    /// <returns>List-based matrix with all entries set to <c>false</c>.</returns>
    private static List<List<bool>> GetEmpty(int order)
        => Enumerable.Range(0, order).Select((_) => Enumerable.Repeat(false, order).ToList()).ToList();

    /// <summary>
    /// Create a table based on edge configuration (edges might be user-defined arrows and st-arrows).
    /// </summary>
    /// <param name="edges"></param>
    /// <param name="order"></param>
    /// <returns></returns>
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

    /// <summary>
    /// Number of categories in the matrix.
    /// </summary>
    public int CsCount => _matrix.Count;

    /// <summary>
    /// Does matrix have user-defined arrows (st-arrows should be skipped)?
    /// </summary>
    public bool HasArrows { get; private set; }

    /// <summary>
    /// Does the category on fr-index come before the category on to-index?
    /// </summary>
    /// <param name="fr"></param>
    /// <param name="to"></param>
    /// <returns>fr ---(before)--> to</returns>
    public bool IsBefore(int fr, int to) => (_matrix[fr][to]);

    public ListPrecedenceMatrix(List<List<bool>> matrix, bool hasArrows)
    {
        _matrix = matrix; HasArrows = hasArrows;
    }
}
