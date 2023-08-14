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
    private readonly Dictionary<string, List<string>> _attributeLists = new();

    private TrieKeywordsAdvicer() { }

    private void Add(string term, List<string> attributeList, long freq)
    {
        _attributeLists[term] = attributeList;
        _trie.AddTerm(term, freq);
    }

    public Task<List<KeywordsAdviceItem>> GetTopK(string prefix, int count)
    {
        var result = _trie
            .GetTopkTermsForPrefix(prefix, count, out _)
            .Select((pair) => new KeywordsAdviceItem() {
                keyword = pair.term, attributeList = _attributeLists[pair.term] })
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
            advicer.Add(item.keyword, item.attributeList, item.count);
        }
        return advicer;
    }
}
