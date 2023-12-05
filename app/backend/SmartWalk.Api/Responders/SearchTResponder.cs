using Microsoft.AspNetCore.Mvc;

/// <summary>
/// Endpoint-specific responder.
/// </summary>
internal class SearchTResponder<T> : ResponderBase<T>
{
    public override ActionResult<T> Respond(T result)
    {
        return result;
    }
}
