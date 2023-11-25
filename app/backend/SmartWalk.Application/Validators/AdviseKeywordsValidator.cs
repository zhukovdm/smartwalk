using SmartWalk.Application.Interfaces;

namespace SmartWalk.Application.Validators;

/// <summary>
/// Handler-specific validator.
/// </summary>
public class AdviseKeywordsValidator : RequestValidatorBase<object>
{
    public AdviseKeywordsValidator(IValidationResult result) : base(result) { }

    public override bool Validate(object input) => true;
}
