using Microsoft.AspNetCore.Mvc.ModelBinding;
using SmartWalk.Application.Interfaces;

/// <summary>
/// Abstraction over controller Model State and the corresponding request handler.
/// </summary>
internal sealed class ModelStateWrapper : IValidationResult
{
    private readonly ModelStateDictionary model;

    public ModelStateWrapper(ModelStateDictionary model) { this.model = model; }

    /// <summary>
    /// Add detected error to the collection.
    /// </summary>
    /// <param name="item">Associate error with the item.</param>
    /// <param name="errorMessage">Error message.</param>
    public void AddError(string item, string errorMessage)
    {
        model.AddModelError(item, errorMessage);
    }
}
