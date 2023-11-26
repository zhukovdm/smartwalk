namespace SmartWalk.Core.Interfaces;

/// <summary>
/// Distance function abstraction.
/// </summary>
public interface IDistanceFunction
{
    /// <summary>
    /// Calculate (fr -> to)-distance.
    /// </summary>
    /// <param name="fr">Identifier of the from place.</param>
    /// <param name="to">Identifier of the to place.</param>
    /// <returns>Distance in meters.</returns>
    double GetDistance(int fr, int to);
}
