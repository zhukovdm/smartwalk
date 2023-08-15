namespace SmartWalk.Domain.Interfaces;

public interface IPrecedenceMatrix
{
    /// <summary>
    /// Number of categories in the matrix.
    /// </summary>
    public int CsCount { get; }

    /// <summary>
    /// Number of original edges in the matrix.
    /// </summary>
    public int EsCount { get; }

    /// <param name="l">L-category</param>
    /// <param name="r">R-category</param>
    /// <returns>L-category shall appear before R-category.</returns>
    bool IsBefore(int l, int r);
}
