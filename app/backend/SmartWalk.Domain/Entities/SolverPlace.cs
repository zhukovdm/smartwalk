namespace SmartWalk.Domain.Entities;

public class SolverPlace
{
    /// <summary>
    /// Index in the distance matrix.
    /// </summary>
    public int Idx { get; }

    /// <summary>
    /// Index of a category associated with the place.
    /// </summary>
    public int Cat { get; }

    public SolverPlace(int idx, int cat) { Idx = idx; Cat = cat; }
}
