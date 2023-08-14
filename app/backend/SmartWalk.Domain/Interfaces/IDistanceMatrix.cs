namespace SmartWalk.Domain.Interfaces;

public interface IDistanceMatrix
{
    /// <summary>
    /// Number of items in the matrix.
    /// </summary>
    public int Count { get; }

    /// <summary>
    /// Calculate the distance between a source and target.
    /// </summary>
    /// <param name="fr">Index of the source</param>
    /// <param name="to">Index of the target</param>
    /// <returns>Distance in meters.</returns>
    public double GetDistance(int fr, int to);
}
