namespace SmartWalk.Model.Interfaces;

public interface IPrecedenceMatrix
{
    /// <summary>
    /// Number of categories in the matrix.
    /// </summary>
    int CsCount { get; }

    /// <summary>
    /// True whenever a matrix has at least one user-defined edge.
    /// </summary>
    bool HasArrows { get; }

    /// <param name="l">L-category</param>
    /// <param name="r">R-category</param>
    /// <returns>Shall L-category appear before R-category?</returns>
    bool IsBefore(int l, int r);
}
