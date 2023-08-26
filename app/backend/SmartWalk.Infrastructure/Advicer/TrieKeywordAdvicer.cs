using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson.Serialization.Attributes;
using SmartWalk.Domain.Entities;
using SmartWalk.Domain.Interfaces;

namespace SmartWalk.Infrastructure.Advicer;

using Trie = PruningRadixTrie.PruningRadixTrie;

internal sealed class TrieKeywordsAdvicer : IKeywordsAdvicer
{
    private readonly Trie _trie = new();
    private readonly Dictionary<string, KeywordsAdviceItem> _items = new();

    private TrieKeywordsAdvicer() { }

    private void Add(string term, KeywordsAdviceItem attributeList, long freq)
    {
        _items[term] = attributeList;
        _trie.AddTerm(term, freq);
    }

    public Task<List<KeywordsAdviceItem>> GetTopK(string prefix, int count)
    {
        var result = _trie
            .GetTopkTermsForPrefix(prefix, count, out _)
            .Select((pair) => _items[pair.term])
            .ToList();

        return Task.FromResult(result);
    }

    [BsonIgnoreExtraElements]
    internal class Item : KeywordsAdviceItem
    {
        public int count { get; init; }
    }

    internal static IKeywordsAdvicer GetInstance(IEnumerable<Item> items)
    {
        var advicer = new TrieKeywordsAdvicer();

        foreach (var item in items)
        {
            advicer.Add(
                item.keyword,
                new()
                {
                    keyword = item.keyword,
                    attributeList = item.attributeList,
                    bounds = item.bounds
                },
                item.count
            );
        }
        return advicer;
    }
}
