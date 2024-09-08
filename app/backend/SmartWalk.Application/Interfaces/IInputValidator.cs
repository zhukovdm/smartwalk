namespace SmartWalk.Application.Interfaces;

/// <summary>
/// Validate input object and collect errors.
/// </summary>
/// <typeparam name="T">Input type</typeparam>
public interface IInputValidator<T>
{
    /// <summary>
    /// Domain-specific validation procedure.
    /// </summary>
    /// <param name="validErrors">Validation errors.</param>
    /// <param name="input">Object to be validated.</param>
    /// <returns>True if valid, and False otherwise.</returns>
    public abstract bool Validate(IErrors validErrors, T input);
}
