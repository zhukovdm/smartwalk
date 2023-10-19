using Microsoft.AspNetCore.Mvc.ModelBinding;
using SmartWalk.Application.Interfaces;

/// <summary>
/// Abstraction over controller model state.
/// </summary>
internal sealed class ModelStateWrapper : IValidationResult
{
    private readonly ModelStateDictionary _model;

    public ModelStateWrapper(ModelStateDictionary model) { _model = model; }

    public void AddError(string item, string errorMessage)
    {
        _model.AddModelError(item, errorMessage);
    }
}
