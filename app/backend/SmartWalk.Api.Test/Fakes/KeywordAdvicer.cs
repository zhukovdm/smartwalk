using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using SmartWalk.Model.Entities;
using SmartWalk.Model.Interfaces;

namespace SmartWalk.Api.Test.Fakes;

internal class FakeWorkingKeywordAdvicer : IKeywordAdvicer
{
    public Task<List<KeywordAdviceItem>> GetTopK(string prefix, int count)
        => Task.FromResult(new List<KeywordAdviceItem>() { new() });
}

internal class FakeFailingKeywordAdvicer : IKeywordAdvicer
{
    public Task<List<KeywordAdviceItem>> GetTopK(string prefix, int count)
        => throw new Exception($"{this.GetType()}: GetTopK");
}
