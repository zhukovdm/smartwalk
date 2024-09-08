using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using SmartWalk.Core.Entities;
using SmartWalk.Core.Interfaces;

namespace SmartWalk.Api.Test.Fakes;

internal class FakeWorkingKeywordAdvicer : IKeywordAdvicer
{
    public Task<List<KeywordAdviceItem>> GetTopK(string prefix, int count)
    {
        return Task.FromResult(new List<KeywordAdviceItem>() { new() });
    }
}

internal class FakeFailingKeywordAdvicer : IKeywordAdvicer
{
    public Task<List<KeywordAdviceItem>> GetTopK(string prefix, int count)
    {
        throw new Exception($"{GetType()}: GetTopK");
    }
}
