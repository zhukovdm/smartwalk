namespace SmartWalk.Application.Interfaces;

/// <summary>
/// Interface for interactions between ModelState of a controller
/// and the corresponding request handler.
/// </summary>
public interface IValidationResult
{
    /// <summary>
    /// Eventually reports validation errors to the user.
    /// </summary>
    /// <param name="item"></param>
    /// <param name="errorMessage"></param>
    void AddError(string item, string errorMessage);
}
