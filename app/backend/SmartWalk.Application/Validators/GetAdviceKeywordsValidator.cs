using SmartWalk.Application.Interfaces;

namespace SmartWalk.Application.Validators;

/// <summary>
/// Handler-specific validator.
/// </summary>
public sealed class GetAdviceKeywordsValidator : RequestValidatorBase<object>
{
    public GetAdviceKeywordsValidator(IValidationResult result) : base(result) { }

    public override bool Validate(object input) => true;
}
