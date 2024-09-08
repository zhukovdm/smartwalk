using Microsoft.AspNetCore.Mvc.ModelBinding;
using SmartWalk.Application.Interfaces;

/// <summary>
/// Abstraction over controller Model State and the corresponding request
/// handler hiding AspNetCore dependency.
/// </summary>
internal sealed class ModelStateWrapper : IErrors
{
    private readonly ModelStateDictionary model;

    public ModelStateWrapper(ModelStateDictionary model) { this.model = model; }

    /// <summary>
    /// Add detected error to the collection.
    /// </summary>
    /// <param name="item">Associate error with the item.</param>
    /// <param name="errorMessage">Error message.</param>
    public void Add(string item, string errorMessage)
    {
        model.AddModelError(item, errorMessage);
    }
}
