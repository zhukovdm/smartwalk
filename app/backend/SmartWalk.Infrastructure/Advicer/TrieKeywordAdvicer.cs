using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson.Serialization.Attributes;
using SmartWalk.Model.Entities;
using SmartWalk.Model.Interfaces;

namespace SmartWalk.Infrastructure.Advicer;

using Trie = PruningRadixTrie.PruningRadixTrie;

/// <summary>
/// In-memory collection for finding top-k keywords with the highest score.
/// </summary>
internal sealed class TrieKeywordAdvicer : IKeywordAdvicer
{
    private readonly Trie _trie = new();
    private readonly Dictionary<string, KeywordAdviceItem> _items = new();

    private TrieKeywordAdvicer() { }

    private void Add(string term, KeywordAdviceItem item, long freq)
    {
        _items[term] = item;
        _trie.AddTerm(term, freq);
    }

    public Task<List<KeywordAdviceItem>> GetTopK(string prefix, int count)
    {
        var result = _trie
            .GetTopkTermsForPrefix(prefix, count, out _)
            .Select((triePair) => _items[triePair.term])
            .ToList();

        return Task.FromResult(result);
    }

    [BsonIgnoreExtraElements]
    internal class Item : KeywordAdviceItem
    {
        public int count { get; init; }
    }

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
