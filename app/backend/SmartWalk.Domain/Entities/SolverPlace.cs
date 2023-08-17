namespace SmartWalk.Domain.Entities;

public sealed class SolverPlace
{
    /// <summary>
    /// Index in the distance matrix.
    /// </summary>
    public int idx { get; }

    /// <summary>
    /// Index of a category associated with the place.
    /// </summary>
    public int cat { get; }

    public SolverPlace(int idx, int cat) { this.idx = idx; this.cat = cat; }
}
