using SmartWalk.Application.Interfaces;

namespace SmartWalk.Application.Validators;

/// <summary>
/// Handler-specific validator.
/// </summary>
public sealed class GetAdviceKeywordsValidator : IInputValidator<object>
{
    public bool Validate(IErrors validErrors, object input) => true;
}
