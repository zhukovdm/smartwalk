using MongoDB.Bson;
using SmartWalk.Application.Interfaces;

namespace SmartWalk.Application.Validators;

/// <summary>
/// Handler-specific validator.
/// </summary>
public sealed class GetEntityPlaceValidator : IInputValidator<string>
{
    public bool Validate(IErrors validErrors, string smartId)
    {
        var valid = ObjectId.TryParse(smartId, out _);

        if (!valid)
        {
            validErrors.Add("smartId", "Malformed identifier.");
        }
        return valid;
    }
}
