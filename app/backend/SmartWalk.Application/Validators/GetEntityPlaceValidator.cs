using MongoDB.Bson;
using SmartWalk.Application.Interfaces;

namespace SmartWalk.Application.Validators;

/// <summary>
/// Handler-specific validator.
/// </summary>
public sealed class GetEntityPlaceValidator : RequestValidatorBase<string>
{
    public GetEntityPlaceValidator(IValidationResult result) : base(result) { }

    public override bool Validate(string smartId)
    {
        var valid = ObjectId.TryParse(smartId, out _);

        if (!valid)
        {
            _result.AddError("smartId", "Malformed identifier.");
        }
        return valid;
    }
}
