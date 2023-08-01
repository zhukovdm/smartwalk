namespace SmartWalk.Domain.Interfaces;

public interface IDistanceMatrix
{
    /// <summary>
    /// Calculate the distance between a source and target.
    /// </summary>
    /// <param name="fr">Index of the source</param>
    /// <param name="to">Index of the target</param>
    /// <returns>Distance in meters.</returns>
    public double Distance(int fr, int to);
}
