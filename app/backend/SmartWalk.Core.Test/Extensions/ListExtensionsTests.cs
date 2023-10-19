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
        return new()
        {
            smartId = handle,
            name = "Place",
            location = new(0.0, 0.0),
            keywords = new() { "a" },
            categories = new() { i }
        };
    }

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
        .Select((handle, i) => GetPlace(handle, i))
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
        .Select((handle, i) => GetPlace(handle, i))
        .ToList()
        .WithMergedCategories();

        Assert.AreEqual(places.Count, 3);
    }
}
