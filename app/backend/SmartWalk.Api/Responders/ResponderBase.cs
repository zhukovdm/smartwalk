using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

internal abstract class ResponderBase<T>
{
    public abstract ActionResult<T> Respond(T result);

    public ActionResult<T> Failure()
    {
        return new StatusCodeResult(StatusCodes.Status500InternalServerError);
    }
}
