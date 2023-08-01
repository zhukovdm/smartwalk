using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SmartWalk.Domain.Entities;
using SmartWalk.Domain.Interfaces;

namespace SmartWalk.Services.Advicer;

using Trie = PruningRadixTrie.PruningRadixTrie;

internal sealed class TrieKeywordAdvicer : IKeywordAdvicer
{
    private readonly Trie _trie = new();
    private readonly Dictionary<string, List<string>> _attributeLists = new();

    private TrieKeywordAdvicer() { }

    private void Add(string term, List<string> attributeList, long freq)
    {
        _attributeLists[term] = attributeList;
        _trie.AddTerm(term, freq);
    }

    public Task<List<Keyword>> GetTopK(string prefix, int count)
    {
        var result = _trie
            .GetTopkTermsForPrefix(prefix, count, out _)
            .Select((pair) => new Keyword() { label = pair.term, attributeList = _attributeLists[pair.term] })
            .ToList();

        return Task.FromResult(result);
    }

    internal class Item : Keyword
    {
        public int count { get; init; }
    }

    internal static IKeywordAdvicer GetInstance(IEnumerable<Item> items)
    {
        var advicer = new TrieKeywordAdvicer();

        foreach (var item in items)
        {
            advicer.Add(item.label, item.attributeList, item.count);
        }
        return advicer;
    }
}
