using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

/// <summary>
/// Responder to determine the final response representation.
/// </summary>
/// <typeparam name="T">Type of a result object.</typeparam>
internal abstract class ResponderBase<T>
{
    /// <summary>
    /// Report service failure.
    /// </summary>
    /// <returns>Status code.</returns>
    public ActionResult<T> Failure()
    {
        return new StatusCodeResult(StatusCodes.Status500InternalServerError);
    }

    /// <summary>
    /// Report domain-level validation errors.
    /// </summary>
    /// <param name="controller">Controller processing the request.</param>
    /// <returns>Dictionary-based structure with errors.</returns>
    public ActionResult<T> Invalid(ControllerBase controller)
    {
        return controller.ValidationProblem();
    }

    /// <summary>
    /// Valid response representation.
    /// </summary>
    /// <param name="handlerResult">Calculated result by the handler.</param>
    /// <returns>Object or status code.</returns>
    public abstract ActionResult<T> Respond(T handlerResult);
}
