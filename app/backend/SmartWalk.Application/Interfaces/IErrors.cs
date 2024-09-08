namespace SmartWalk.Application.Interfaces;

public interface IErrors
{
    /// <summary>
    /// Collection of validation and parse errors.
    /// </summary>
    /// <param name="item">Name of the invalid item.</param>
    /// <param name="errorMessage">Error message.</param>
    void Add(string item, string errorMessage);
}
