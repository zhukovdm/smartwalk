namespace SmartWalk.Domain.Interfaces;

public interface IPrecedenceMatrix
{
    /// <summary>
    /// Number of categories in the matrix.
    /// </summary>
    int CsCount { get; }

    /// <summary>
    /// True whenever a matrix has at least one non-terminal edge.
    /// </summary>
    bool HasNonTerminalEdges { get; }

    /// <param name="l">L-category</param>
    /// <param name="r">R-category</param>
    /// <returns>Shall L-category appear before R-category?</returns>
    bool IsBefore(int l, int r);
}
