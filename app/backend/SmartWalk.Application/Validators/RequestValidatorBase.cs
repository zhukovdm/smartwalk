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

    /// <summary>
    /// Domain-specific validation procedure.
    /// </summary>
    /// <param name="input">Object to be validated.</param>
    /// <returns>True if valid.</returns>
    public abstract bool Validate(T input);
}
