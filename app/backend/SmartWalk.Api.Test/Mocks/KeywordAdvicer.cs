using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using SmartWalk.Model.Entities;
using SmartWalk.Model.Interfaces;

namespace SmartWalk.Api.Test.Mocks;

internal class WorkingKeywordAdvicerMock : IKeywordAdvicer
{
    public Task<List<KeywordAdviceItem>> GetTopK(string prefix, int count)
    {
        return Task.FromResult(new List<KeywordAdviceItem>()
        {
            new()
            {
                keyword = "museum",
                attributeList = new() { "image" },
                numericBounds = new(),
                collectBounds = new()
            }
        });
    }
}

internal class FailingKeywordAdvicerMock : IKeywordAdvicer
{
    public Task<List<KeywordAdviceItem>> GetTopK(string prefix, int count)
    {
        throw new NotImplementedException();
    }
}
