using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using SmartWalk.Infrastructure.Mongo.Helpers;

namespace SmartWalk.Infrastructure.Test;

using Item = TrieKeywordAdvicer.Item;

[TestClass]
public class TrieKeywordAdvicerTests
{
    private static readonly List<Item> items = new()
    {
        new() { keyword = "abc", count = 1 },
        new() { keyword = "abd", count = 2 },
        new() { keyword = "abe", count = 3 },
        new() { keyword = "aca", count = 4 },
        new() { keyword = "bcd", count = 5 },
    };

    [TestMethod]
    public void ShouldConstructTrieAdvicer()
    {
        Assert.IsNotNull(TrieKeywordAdvicer.GetInstance(items));
    }

    [TestMethod]
    public async Task ShouldGetItemsByPrefixOrderedByCount()
    {
        var advicer = TrieKeywordAdvicer.GetInstance(TrieKeywordAdvicerTests.items);
        var items = (await advicer.GetTopK("ab", int.MaxValue))
            .Select((item) => item.keyword).ToList();

        var expected = new List<string> { "abe", "abd", "abc" };

        Assert.AreEqual(items.Count, expected.Count);

        for (int i = 0; i < items.Count; ++i)
        {
            Assert.AreEqual(items[i], expected[i]);
        }
    }

    /*
     * Note that empty strings are eliminated on the input by
     * the request pipeline and, therefore, are not tested.
     */

    [TestMethod]
    public async Task ShouldReturnEmptyResult()
    {
        var advicer = TrieKeywordAdvicer.GetInstance(TrieKeywordAdvicerTests.items);
        var items = await advicer.GetTopK("c", int.MaxValue);

        Assert.AreEqual(0, items.Count);
    }

    [TestMethod]
    public async Task ShouldBoundNumberOfReturnedItemsByCount()
    {
        var advicer = TrieKeywordAdvicer.GetInstance(TrieKeywordAdvicerTests.items);
        var items = await advicer.GetTopK("ab", 2);

        Assert.AreEqual(2, items.Count);
    }
}
