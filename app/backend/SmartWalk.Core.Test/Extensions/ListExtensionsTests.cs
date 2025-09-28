using System.Collections.Generic;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using SmartWalk.Core.Entities;
using SmartWalk.Core.Extensions;

namespace SmartWalk.Core.Test;

[TestClass]
public class ListExtensionsTests
{
    private static Place GetPlace(string handle, int i)
    {
        return new ()
        {
            smartId = handle,
            name = "Place",
            location = new (0.0, 0.0),
            keywords = ["a"],
            categories = [i]
        };
    }

    // Swap

    [TestMethod]
    public void ShouldSwapElementsOfList()
    {
        var lst = new List<int> { 0, 1, 2, 3, 4, 5 };
        lst.Swap(1, 4);
        Assert.AreEqual(4, lst[1]);
        Assert.AreEqual(1, lst[4]);
    }

    // Durstenfeld shuffle

    [TestMethod]
    public void ShouldRetainAllElementsAfterShuffle()
    {
        var lst = new List<int> { 0, 1, 2, 3, 4, 5 };
        lst = lst.DurstenfeldShuffle();
        foreach (var item in new[] { 0, 1, 2, 3, 4, 5 })
        {
            Assert.IsTrue(lst.Contains(item));
        }
    }

    // Merged categories

    [TestMethod]
    public void ShouldHandleEmptyListGracefully()
    {
        var places = new List<Place>().WithMergedCategories();
        Assert.AreEqual(places.Count, 0);
    }

    [TestMethod]
    public void ShouldMergeAllPlacesIntoOne()
    {
        var places = new List<string>()
        {
            "A",
            "A",
            "A"
        }
        .Select(GetPlace)
        .ToList()
        .WithMergedCategories();

        Assert.AreEqual(places.Count, 1);
        Assert.AreEqual(places.FirstOrDefault()?.categories.Count, 3);
    }

    [TestMethod]
    public void ShouldNotMergeCategoriesForDifferentPlaces()
    {
        var places = new List<string>()
        {
            "A",
            "B",
            "C"
        }
        .Select(GetPlace)
        .ToList()
        .WithMergedCategories();

        Assert.AreEqual(places.Count, 3);
    }
}
