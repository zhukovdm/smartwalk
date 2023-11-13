using Microsoft.AspNetCore.Mvc;

internal class SearchTResponder<T> : ResponderBase<T>
{
    public override ActionResult<T> Respond(T result)
    {
        return result;
    }
}
