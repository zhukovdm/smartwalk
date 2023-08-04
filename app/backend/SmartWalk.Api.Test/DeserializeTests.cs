using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NJsonSchema;
using SmartWalk.Api.Controllers;
using static SmartWalk.Api.Controllers.SearchController;

namespace SmartWalk.Api.Tests;

/// <summary>
/// All queries are eventually JSON objects. NJsonSchema internally uses
/// primitive from json.net library. The behavior of it is sometimes unexpected,
/// corner cases are tested by the class below. Tests are applicable for all
/// user-defined classes.
/// </summary>
[TestClass]
public class QueryDeserializeTests
{
    private static readonly JsonSchema _s = JsonSchema.FromType<DirecsQuery>();

    [TestMethod]
    [ExpectedException(typeof(Newtonsoft.Json.JsonReaderException))]
    public void EmptyQuery()
    {
        SearchController.DeserializeQuery<DirecsQuery>("", _s); // invalid Json!
    }

    [TestMethod]
    [ExpectedException(typeof(Newtonsoft.Json.JsonReaderException))]
    public void QueryAsInvalidJsonString()
    {
        SearchController.DeserializeQuery<DirecsQuery>("{1}", _s);
    }

    [TestMethod]
    [ExpectedException(typeof(Exception))]
    public void QueryAsEmptyObject()
    {
        SearchController.DeserializeQuery<DirecsQuery>("{}", _s);
    }

    [TestMethod]
    [ExpectedException(typeof(Exception))]
    public void QueryAsEmptyArray()
    {
        SearchController.DeserializeQuery<DirecsQuery>("[]", _s);
    }

    [TestMethod]
    [ExpectedException(typeof(Exception))]
    public void QueryAsEmptyString()
    {
        SearchController.DeserializeQuery<DirecsQuery>("\"\"", _s);
    }

    [TestMethod]
    [ExpectedException(typeof(Exception))]
    public void QueryAsZeroString()
    {
        SearchController.DeserializeQuery<DirecsQuery>("0", _s);
    }

    [TestMethod]
    [ExpectedException(typeof(Exception))]
    public void QueryAsNumberString()
    {
        SearchController.DeserializeQuery<DirecsQuery>("1", _s);
    }

    [TestMethod]
    [ExpectedException(typeof(Exception))]
    public void QueryAsTrueString()
    {
        SearchController.DeserializeQuery<DirecsQuery>("true", _s);
    }

    [TestMethod]
    [ExpectedException(typeof(Exception))]
    public void QueryAsFalseString()
    {
        SearchController.DeserializeQuery<DirecsQuery>("false", _s);
    }

    [TestMethod]
    [ExpectedException(typeof(Exception))]
    public void QueryAsNullString()
    {
        SearchController.DeserializeQuery<DirecsQuery>("null", _s);
    }
}

[TestClass]
public class WebPointDeserializeTests
{
    private static readonly JsonSchema _s = JsonSchema.FromType<WebPoint>();

    [TestMethod]
    [ExpectedException(typeof(Exception))]
    public void MissingLon()
    {
        var q = @"{
            ""lat"": 0.0
        }";
        SearchController.DeserializeQuery<WebPoint>(q, _s);
    }

    [TestMethod]
    [ExpectedException(typeof(Exception))]
    public void BelowLowerBoundLon()
    {
        var q = @"{
            ""lon"": -181.0,
            ""lat"": 0.0
        }";
        SearchController.DeserializeQuery<WebPoint>(q, _s);
    }

    [TestMethod]
    [ExpectedException(typeof(Exception))]
    public void AboveUpperBoundLon()
    {
        var q = @"{
            ""lon"": 181.0,
            ""lat"": 0.0
        }";
        SearchController.DeserializeQuery<WebPoint>(q, _s);
    }

    [TestMethod]
    [ExpectedException(typeof(Exception))]
    public void MissingLat()
    {
        var q = @"{
            ""lon"": 0.0
        }";
        SearchController.DeserializeQuery<WebPoint>(q, _s);
    }

    [TestMethod]
    [ExpectedException(typeof(Exception))]
    public void BelowLowerBoundLat()
    {
        var q = @"{
            ""lon"": 0.0,
            ""lat"": -86.0
        }";
        SearchController.DeserializeQuery<WebPoint>(q, _s);
    }

    [TestMethod]
    [ExpectedException(typeof(Exception))]
    public void AboveUpperBoundLat()
    {
        var q = @"{
            ""lon"": 0.0,
            ""lat"": 86.0
        }";
        SearchController.DeserializeQuery<WebPoint>(q, _s);
    }

    [TestMethod]
    public void WellFormed()
    {
        var q = @"{
            ""lon"": 0.0,
            ""lat"": 0.0
        }";
        SearchController.DeserializeQuery<WebPoint>(q, _s);
    }
}

[TestClass]
public class WebPrecedenceEdgeDeserializeTests
{
    private static readonly JsonSchema _s = JsonSchema.FromType<WebPrecedenceEdge>();

    [TestMethod]
    [ExpectedException(typeof(Exception))]
    public void MissingFr()
    {
        var q = @"{
            ""to"": 0
        }";
        SearchController.DeserializeQuery<WebPrecedenceEdge>(q, _s);
    }

    [TestMethod]
    [ExpectedException(typeof(Exception))]
    public void BelowLowerBoundFr()
    {
        var q = @"{
            ""fr"": -1,
            ""to"": 0
        }";
        SearchController.DeserializeQuery<WebPrecedenceEdge>(q, _s);
    }

    [TestMethod]
    [ExpectedException(typeof(Exception))]
    public void MissingTo()
    {
        var q = @"{
            ""fr"": 0
        }";
        SearchController.DeserializeQuery<WebPrecedenceEdge>(q, _s);
    }

    [TestMethod]
    [ExpectedException(typeof(Exception))]
    public void BelowLowerBoundTo()
    {
        var q = @"{
            ""fr"": 0,
            ""to"": -1
        }";
        SearchController.DeserializeQuery<WebPrecedenceEdge>(q, _s);
    }

    [TestMethod]
    [ExpectedException(typeof(Exception))]
    public void ExtraProperty()
    {
        var q = @"{
            ""fr"": 0,
            ""to"": 0,
            ""ex"": 0
        }";
        SearchController.DeserializeQuery<WebPrecedenceEdge>(q, _s);
    }

    [TestMethod]
    public void WellFormed()
    {
        var q = @"{
            ""fr"": 0,
            ""to"": 0
        }";
        SearchController.DeserializeQuery<WebPrecedenceEdge>(q, _s);
    }
}

[TestClass]
public class CategoryDeserializeTests
{
    
}

[TestClass]
public class DirecsQueryDeserializeTests
{
    private static readonly JsonSchema _s = JsonSchema.FromType<DirecsQuery>();

    [TestMethod]
    [ExpectedException(typeof(Exception))]
    public void MissingWaypoints()
    {
        var q = @"{}";
        SearchController.DeserializeQuery<DirecsQuery>(q, _s);
    }

    [TestMethod]
    [ExpectedException(typeof(Exception))]
    public void TooSmallNumberOfWaypoints()
    {
        var q = @"
        {
            ""waypoints"":[
                { ""lon"": 0.0, ""lat"": 0.0 }
            ]
        }";
        SearchController.DeserializeQuery<DirecsQuery>(q, _s);
    }

    [TestMethod]
    [ExpectedException(typeof(Exception))]
    public void ExtraProperty()
    {
        var q = @"
        {
            ""waypoints"":[
                { ""lon"": 0.0, ""lat"": 0.0 },
                { ""lon"": 1.0, ""lat"": 1.0 }
            ],
            ""ex"": 0
        }";
        SearchController.DeserializeQuery<DirecsQuery>(q, _s);
    }

    [TestMethod]
    public void WellFormed()
    {
        var q = @"
        {
            ""waypoints"":[
                { ""lon"": 0.0, ""lat"": 0.0 },
                { ""lon"": 1.0, ""lat"": 1.0 }
            ]
        }";
        SearchController.DeserializeQuery<DirecsQuery>(q, _s);
    }
}

[TestClass]
public class PlacesQueryDeserializeTests
{
    private static readonly JsonSchema _s = JsonSchema.FromType<PlacesQuery>();

    [TestMethod]
    [ExpectedException(typeof(Exception))]
    public void MissingCenter()
    {
        var q = @"
        {
            ""radius"": 0,
            ""categories"": [],
            ""offset"": 0,
            ""bucket"": 0
        }";
        SearchController.DeserializeQuery<PlacesQuery>(q, _s);
    }

    [TestMethod]
    [ExpectedException(typeof(Exception))]
    public void MissingRadius()
    {
        var q = @"
        {
            ""center"": { ""lon"": 0.0, ""lat"": 0.0 },
            ""categories"": [],
            ""offset"": 0,
            ""bucket"": 0
        }";
        SearchController.DeserializeQuery<PlacesQuery>(q, _s);
    }

    [TestMethod]
    [ExpectedException(typeof(Exception))]
    public void RadiusBelowLowerBound()
    {
        var q = @"
        {
            ""center"": { ""lon"": 0.0, ""lat"": 0.0 },
            ""radius"": -1,
            ""categories"": [],
            ""offset"": 0,
            ""bucket"": 0
        }";
        SearchController.DeserializeQuery<PlacesQuery>(q, _s);
    }

    [TestMethod]
    [ExpectedException(typeof(Exception))]
    public void RadiusAboveUpperBound()
    {
        var q = @"
        {
            ""center"": { ""lon"": 0.0, ""lat"": 0.0 },
            ""radius"": 12001,
            ""categories"": [],
            ""offset"": 0,
            ""bucket"": 0
        }";
        SearchController.DeserializeQuery<PlacesQuery>(q, _s);
    }

    [TestMethod]
    [ExpectedException(typeof(Exception))]
    public void MissingCategories()
    {
        var q = @"
        {
            ""center"": { ""lon"": 0.0, ""lat"": 0.0 },
            ""radius"": 0,
            ""offset"": 0,
            ""bucket"": 0
        }";
        SearchController.DeserializeQuery<PlacesQuery>(q, _s);
    }

    [TestMethod]
    [ExpectedException(typeof(Exception))]
    public void MissingOffset()
    {
        var q = @"
        {
            ""center"": { ""lon"": 0.0, ""lat"": 0.0 },
            ""radius"": 0,
            ""categories"": [],
            ""bucket"": 0
        }";
        SearchController.DeserializeQuery<PlacesQuery>(q, _s);
    }

    [TestMethod]
    [ExpectedException(typeof(Exception))]
    public void OffsetBelowLowerBound()
    {
        var q = @"
        {
            ""center"": { ""lon"": 0.0, ""lat"": 0.0 },
            ""radius"": 0,
            ""categories"": [],
            ""offset"": -1,
            ""bucket"": 0
        }";
        SearchController.DeserializeQuery<PlacesQuery>(q, _s);
    }

    [TestMethod]
    [ExpectedException(typeof(Exception))]
    public void MissingBucket()
    {
        var q = @"
        {
            ""center"": { ""lon"": 0.0, ""lat"": 0.0 },
            ""radius"": 0,
            ""categories"": [],
            ""offset"": 0
        }";
        SearchController.DeserializeQuery<PlacesQuery>(q, _s);
    }

    [TestMethod]
    [ExpectedException(typeof(Exception))]
    public void BucketBelowLowerBound()
    {
        var q = @"
        {
            ""center"": { ""lon"": 0.0, ""lat"": 0.0 },
            ""radius"": 0,
            ""categories"": [],
            ""offset"": 0,
            ""bucket"": -1
        }";
        SearchController.DeserializeQuery<PlacesQuery>(q, _s);
    }
}

[TestClass]
public class RoutesQueryDeserializeTests
{
    [TestMethod]
    public void Test()
    {
    }
}
