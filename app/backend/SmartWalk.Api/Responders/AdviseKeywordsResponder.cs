using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using SmartWalk.Core.Entities;

/// <summary>
/// Endpoint-specific responder.
/// </summary>
internal class AdviseKeywordsResponder : ResponderBase<List<KeywordAdviceItem>>
{
    public override ActionResult<List<KeywordAdviceItem>> Respond(List<KeywordAdviceItem> result)
    {
        return result;
    }
}
