namespace SmartWalk.Core.Entities;

public sealed class SolverPlace
{
    /// <summary>
    /// Identifier for the distance function.
    /// </summary>
    public int idx { get; }

    /// <summary>
    /// Index of a category associated with the place.
    /// </summary>
    public int cat { get; }

    public SolverPlace(int idx, int cat) { this.idx = idx; this.cat = cat; }
}
