using Microsoft.AspNetCore.Mvc;
using SmartWalk.Core.Entities;

/// <summary>
/// Endpoint-specific responder.
/// </summary>
internal class GetEntityPlaceResponder : ResponderBase<ExtendedPlace>
{
    public override ActionResult<ExtendedPlace> Respond(ExtendedPlace result)
    {
        return (result is not null) ? result : new NotFoundResult();
    }
}
