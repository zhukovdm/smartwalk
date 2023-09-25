using System.Collections.Generic;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using SmartWalk.Core.Heuristics;
using SmartWalk.Domain.Entities;

namespace SmartWalk.Core.Test;

[TestClass]
public class IfCategoryFormerTests
{
    private static readonly int N = 7;

    private List<SolverPlace> GetPlaces()
    {
        var places = new List<SolverPlace>();

        for (int idx = 0; idx < N; ++idx)
        {
            for (int cat = 0; cat < N - idx; ++cat)
            {
                places.Add(new(idx, cat));
            }
        }
        return places;
    }

    [TestMethod]
    public void ShouldSeparatePlacesByCategory()
    {
        var cats = IfCategoryFormer.Form(GetPlaces(), 0, N - 1);

        foreach (var cat in cats)
        {
            var first = cat.FirstOrDefault();

            foreach (var place in cat)
            {
                Assert.AreEqual(first?.cat, place.cat);
            }
        }
    }

    [TestMethod]
    public void ShouldRemoveSourceAndTargetCategories()
    {
        var cats = IfCategoryFormer.Form(GetPlaces(), 1, N - 2);

        Assert.AreEqual(cats.Count, 5);

        foreach (var cat in cats)
        {
            Assert.AreNotEqual(cat.FirstOrDefault()?.cat, 1);
            Assert.AreNotEqual(cat.FirstOrDefault()?.cat, N - 2);
        }
    }

    [TestMethod]
    public void ShouldPrioritizeCategoriesWithLessItems()
    {

    }
}

[TestClass]
public class IfCandidateFinderTests
{

}

[TestClass]
public class IfHeuristicTests
{
    [TestMethod]
    public void Test()
    {
    }
}
