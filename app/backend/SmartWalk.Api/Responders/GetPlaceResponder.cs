using Microsoft.AspNetCore.Mvc;
using SmartWalk.Core.Entities;

internal class GetPlaceResponder : ResponderBase<ExtendedPlace>
{
    public override ActionResult<ExtendedPlace> Respond(ExtendedPlace result)
    {
        return (result is not null) ? result : new NotFoundResult();
    }
}
