using SmartWalk.Application.Interfaces;

namespace SmartWalk.Application.Validators;

/// <summary>
/// Validator with a result.
/// </summary>
/// <typeparam name="T">Input type.</typeparam>
public abstract class RequestValidatorBase<T>
{
    protected readonly IValidationResult _result;

    public RequestValidatorBase(IValidationResult result) { _result = result; }

    public abstract bool Validate(T input);
}
