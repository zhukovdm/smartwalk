using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson.Serialization.Attributes;
using SmartWalk.Core.Entities;
using SmartWalk.Core.Interfaces;

namespace SmartWalk.Infrastructure.Advicer;

using Trie = PruningRadixTrie.PruningRadixTrie;

/// <summary>
/// In-memory collection for finding top-k keywords with the highest score.
/// </summary>
internal sealed class TrieKeywordAdvicer : IKeywordAdvicer
{
    private readonly Trie trie = new();
    private readonly Dictionary<string, KeywordAdviceItem> items = new();

    private TrieKeywordAdvicer() { }

    /// <summary>
    /// Insert term into the collection.
    /// </summary>
    private void Add(string term, KeywordAdviceItem item, long freq)
    {
        items[term] = item;
        trie.AddTerm(term, freq);
    }

    public Task<List<KeywordAdviceItem>> GetTopK(string prefix, int count)
    {
        var result = trie
            .GetTopkTermsForPrefix(prefix, count, out _)
            .Select((triePair) => items[triePair.term])
            .ToList();

        return Task.FromResult(result);
    }

    [BsonIgnoreExtraElements]
    internal class Item : KeywordAdviceItem
    {
        public int count { get; init; }
    }

    /// <summary>
    /// Construct a trie advicer.
    /// </summary>
    /// <param name="items">Items to be accommodated in a trie.</param>
    /// <returns>Trie advicer.</returns>
    internal static IKeywordAdvicer GetInstance(IEnumerable<Item> items)
    {
        var advicer = new TrieKeywordAdvicer();

        foreach (var item in items)
        {
            advicer.Add(
                item.keyword,
                new()
                {
                    keyword = item.keyword,
                    attributeList = item.attributeList,
                    numericBounds = item.numericBounds,
                    collectBounds = item.collectBounds,
                },
                item.count
            );
        }
        return advicer;
    }
}
