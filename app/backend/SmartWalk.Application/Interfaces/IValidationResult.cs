namespace SmartWalk.Application.Interfaces;

public interface IValidationResult
{
    /// <summary>
    /// Report validation errors to the user.
    /// </summary>
    /// <param name="item">Name of the invalid item.</param>
    /// <param name="errorMessage">Error message.</param>
    void AddError(string item, string errorMessage);
}
