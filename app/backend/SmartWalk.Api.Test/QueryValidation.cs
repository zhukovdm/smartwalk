using Microsoft.VisualStudio.TestTools.UnitTesting;
using NJsonSchema;
using SmartWalk.Api.Controllers;
using SmartWalk.Model.Entities;
using static SmartWalk.Api.Controllers.SearchController;

namespace SmartWalk.Api.Test;

/// <summary>
/// All queries are ultimately JSON objects. NJsonSchema internally uses
/// primitives from the `json.net` library. The behavior of it is sometimes
/// unexpected, and corner cases are tested by the class below. Even though
/// schema validates against the `DirecsQuery` type, these tests are applicable
/// to all user-defined classes.
/// </summary>
[TestClass]
public class GeneralValidationTests
{
    private static readonly JsonSchema _schema = JsonSchema.FromType<DirecsQuery>();

    [TestMethod]
    public void EmptyQuery()
    {
        var query = "";
        Assert.IsFalse(SearchController.ValidateQuery<DirecsQuery>(query, _schema, out var _));
    }

    [TestMethod]
    public void QueryAsInvalidJsonString()
    {
        var query = "{1}";
        Assert.IsFalse(SearchController.ValidateQuery<DirecsQuery>(query, _schema, out var _));
    }

    [TestMethod]
    public void QueryAsEmptyObject()
    {
        var query = "{}";
        Assert.IsFalse(SearchController.ValidateQuery<DirecsQuery>(query, _schema, out var _));
    }

    [TestMethod]
    public void QueryAsEmptyArray()
    {
        var query = "[]";
        Assert.IsFalse(SearchController.ValidateQuery<DirecsQuery>(query, _schema, out var _));
    }

    [TestMethod]
    public void QueryAsEmptyString()
    {
        var query = "\"\"";
        Assert.IsFalse(SearchController.ValidateQuery<DirecsQuery>(query, _schema, out var _));
    }

    [TestMethod]
    public void QueryAsNumber()
    {
        var query = "0";
        Assert.IsFalse(SearchController.ValidateQuery<DirecsQuery>(query, _schema, out var _));
    }

    [TestMethod]
    public void QueryAsBoolean()
    {
        var query = "false";
        Assert.IsFalse(SearchController.ValidateQuery<DirecsQuery>(query, _schema, out var _));
    }

    [TestMethod]
    public void QueryAsNull()
    {
        var query = "null";
        Assert.IsFalse(SearchController.ValidateQuery<DirecsQuery>(query, _schema, out var _));
    }
}

[TestClass]
public class WebPointValidationTests
{
    private static readonly JsonSchema _schema = JsonSchema.FromType<WebPoint>();

    [TestMethod]
    public void MissingLon()
    {
        var query = @"{
            ""lat"": 0.0
        }";
        Assert.IsFalse(SearchController.ValidateQuery<WebPoint>(query, _schema, out var _));
    }

    [TestMethod]
    public void BelowLowerBoundLon()
    {
        var query = @"{
            ""lon"": -181.0,
            ""lat"": 0.0
        }";
        Assert.IsFalse(SearchController.ValidateQuery<WebPoint>(query, _schema, out var _));
    }

    [TestMethod]
    public void AboveUpperBoundLon()
    {
        var query = @"{
            ""lon"": 181.0,
            ""lat"": 0.0
        }";
        Assert.IsFalse(SearchController.ValidateQuery<WebPoint>(query, _schema, out var _));
    }

    [TestMethod]
    public void MissingLat()
    {
        var query = @"{
            ""lon"": 0.0
        }";
        Assert.IsFalse(SearchController.ValidateQuery<WebPoint>(query, _schema, out var _));
    }

    [TestMethod]
    public void BelowLowerBoundLat()
    {
        var query = @"{
            ""lon"": 0.0,
            ""lat"": -86.0
        }";
        Assert.IsFalse(SearchController.ValidateQuery<WebPoint>(query, _schema, out var _));
    }

    [TestMethod]
    public void AboveUpperBoundLat()
    {
        var query = @"{
            ""lon"": 0.0,
            ""lat"": 86.0
        }";
        Assert.IsFalse(SearchController.ValidateQuery<WebPoint>(query, _schema, out var _));
    }

    [TestMethod]
    public void WellFormed()
    {
        var query = @"{
            ""lon"": 0.0,
            ""lat"": 0.0
        }";
        Assert.IsTrue(SearchController.ValidateQuery<WebPoint>(query, _schema, out var _));
    }
}

[TestClass]
public class WebPrecedenceEdgeValidationTests
{
    private static readonly JsonSchema _schema = JsonSchema.FromType<WebPrecedenceEdge>();

    [TestMethod]
    public void MissingFr()
    {
        var query = @"{
            ""to"": 0
        }";
        Assert.IsFalse(SearchController.ValidateQuery<WebPrecedenceEdge>(query, _schema, out var _));
    }

    [TestMethod]
    public void BelowLowerBoundFr()
    {
        var query = @"{
            ""fr"": -1,
            ""to"": 0
        }";
        Assert.IsFalse(SearchController.ValidateQuery<WebPrecedenceEdge>(query, _schema, out var _));
    }

    [TestMethod]
    public void MissingTo()
    {
        var query = @"{
            ""fr"": 0
        }";
        Assert.IsFalse(SearchController.ValidateQuery<WebPrecedenceEdge>(query, _schema, out var _));
    }

    [TestMethod]
    public void BelowLowerBoundTo()
    {
        var query = @"{
            ""fr"": 0,
            ""to"": -1
        }";
        Assert.IsFalse(SearchController.ValidateQuery<WebPrecedenceEdge>(query, _schema, out var _));
    }

    [TestMethod]
    public void WellFormed()
    {
        var query = @"{
            ""fr"": 0,
            ""to"": 0
        }";
        Assert.IsTrue(SearchController.ValidateQuery<WebPrecedenceEdge>(query, _schema, out var _));
    }
}

[TestClass]
public class AttributeFilterNumericValidationTests
{
    private static readonly JsonSchema _schema = JsonSchema.FromType<AttributeFilterNumeric>();

    [TestMethod]
    public void MissingMin()
    {
        var query = @"{
            ""max"": 0.0
        }";
        Assert.IsFalse(SearchController.ValidateQuery<AttributeFilterNumeric>(query, _schema, out var _));
    }

    [TestMethod]
    public void MissingMax()
    {
        var query = @"{
            ""min"": 0.0
        }";
        Assert.IsFalse(SearchController.ValidateQuery<AttributeFilterNumeric>(query, _schema, out var _));
    }

    [TestMethod]
    public void WellFormed()
    {
        var query = @"{
            ""min"": 0.0
            ""max"": 0.0
        }";
        Assert.IsFalse(SearchController.ValidateQuery<AttributeFilterNumeric>(query, _schema, out var _));
    }
}

[TestClass]
public class AttributeFilterCollectValidationTests
{
    private static readonly JsonSchema _schema = JsonSchema.FromType<AttributeFilterCollect>();

    [TestMethod]
    public void MissingInc()
    {
        var query = @"{
            ""exc"": [""e""]
        }";
        Assert.IsFalse(SearchController.ValidateQuery<AttributeFilterCollect>(query, _schema, out var _));
    }

    [TestMethod]
    public void MissingExc()
    {
        var query = @"{
            ""inc"": [""i""]
        }";
        Assert.IsFalse(SearchController.ValidateQuery<AttributeFilterCollect>(query, _schema, out var _));
    }

    [TestMethod]
    public void WellFormed()
    {
        var query = @"{
            ""inc"": [""i""],
            ""exc"": [""e""]
        }";
        Assert.IsTrue(SearchController.ValidateQuery<AttributeFilterCollect>(query, _schema, out var _));
    }
}

[TestClass]
public class CategoryValidationTests
{
    private static readonly JsonSchema _schema = JsonSchema.FromType<Category>();

    [TestMethod]
    public void MissingKeyword()
    {
        var query = @"{
            ""filters"": {}
        }";
        Assert.IsFalse(SearchController.ValidateQuery<Category>(query, _schema, out var _));
    }

    [TestMethod]
    public void EmptyKeyword()
    {
        var query = @"{
            ""keyword"": """",
            ""filters"": {}
        }";
        Assert.IsFalse(SearchController.ValidateQuery<Category>(query, _schema, out var _));
    }

    [TestMethod]
    public void MissingFilters()
    {
        var query = @"{
            ""keyword"": ""abc""
        }";
        Assert.IsFalse(SearchController.ValidateQuery<Category>(query, _schema, out var _));
    }
}

[TestClass]
public class DirecsQueryValidationTests
{
    private static readonly JsonSchema _schema = JsonSchema.FromType<DirecsQuery>();

    [TestMethod]
    public void TooShortWaypointSequence()
    {
        var query = @"{
            ""waypoints"":[
                { ""lon"": 0.0, ""lat"": 0.0 }
            ]
        }";
        Assert.IsFalse(SearchController.ValidateQuery<DirecsQuery>(query, _schema, out var _));
    }

    [TestMethod]
    public void WellFormed()
    {
        var query = @"{
            ""waypoints"":[
                { ""lon"": 0.0, ""lat"": 0.0 },
                { ""lon"": 1.0, ""lat"": 1.0 }
            ]
        }";
        Assert.IsTrue(SearchController.ValidateQuery<DirecsQuery>(query, _schema, out var _));
    }
}

[TestClass]
public class PlacesQueryValidationTests
{
    private static readonly JsonSchema _schema = JsonSchema.FromType<PlacesQuery>();

    [TestMethod]
    public void MissingCenter()
    {
        var query = @"{
            ""radius"": 0,
            ""categories"": []
        }";
        Assert.IsFalse(SearchController.ValidateQuery<PlacesQuery>(query, _schema, out var _));
    }

    [TestMethod]
    public void MissingRadius()
    {
        var query = @"{
            ""center"": {
                ""lon"": 0.0,
                ""lat"": 0.0
            },
            ""categories"": []
        }";
        Assert.IsFalse(SearchController.ValidateQuery<PlacesQuery>(query, _schema, out var _));
    }

    [TestMethod]
    public void RadiusBelowLowerBound()
    {
        var query = @"{
            ""center"": {
                ""lon"": 0.0,
                ""lat"": 0.0
            },
            ""radius"": -1.0,
            ""categories"": []
        }";
        Assert.IsFalse(SearchController.ValidateQuery<PlacesQuery>(query, _schema, out var _));
    }

    [TestMethod]
    public void RadiusAboveUpperBound()
    {
        var query = @"{
            ""center"": {
                ""lon"": 0.0,
                ""lat"": 0.0
            },
            ""radius"": 15001.0,
            ""categories"": []
        }";
        Assert.IsFalse(SearchController.ValidateQuery<PlacesQuery>(query, _schema, out var _));
    }

    [TestMethod]
    public void MissingCategories()
    {
        var query = @"{
            ""center"": {
                ""lon"": 0.0,
                ""lat"": 0.0
            },
            ""radius"": 0
        }";
        Assert.IsFalse(SearchController.ValidateQuery<PlacesQuery>(query, _schema, out var _));
    }

    [TestMethod]
    public void WellFormedWithEmptyCategories()
    {
        var query = @"{
            ""center"": {
                ""lon"": 0.0,
                ""lat"": 0.0
            },
            ""radius"": 3000,
            ""categories"": []
        }";
        Assert.IsTrue(SearchController.ValidateQuery<PlacesQuery>(query, _schema, out var _));
    }

    [TestMethod]
    public void WellFormedWithNonEmptyCategories()
    {
        var query = @"{
            ""center"": {
                ""lon"": 0.0,
                ""lat"": 0.0
            },
            ""radius"": 3000,
            ""categories"": [
                {
                    ""keyword"": ""museum"",
                    ""filters"": {}
                }
            ]
        }";
        Assert.IsTrue(SearchController.ValidateQuery<PlacesQuery>(query, _schema, out var _));
    }
}

[TestClass]
public class RoutesQueryValidationTests
{
    private static readonly JsonSchema _schema = JsonSchema.FromType<RoutesQuery>();

    [TestMethod]
    public void MissingSource()
    {
        var query = @"{
            ""target"": {
                ""lon"": 0.0,
                ""lat"": 0.0
            },
            ""maxDistance"": 5.0,
            ""categories"": [
                {
                    ""keyword"": ""museum"",
                    ""filters"": {}
                }
            ],
            ""arrows"": []
        }";
        Assert.IsFalse(SearchController.ValidateQuery<PlacesQuery>(query, _schema, out var _));
    }

    [TestMethod]
    public void MissingTarget()
    {
        var query = @"{
            ""source"": {
                ""lon"": 0.0,
                ""lat"": 0.0
            },
            ""maxDistance"": 5.0,
            ""categories"": [
                {
                    ""keyword"": ""museum"",
                    ""filters"": {}
                }
            ],
            ""arrows"": []
        }";
        Assert.IsFalse(SearchController.ValidateQuery<PlacesQuery>(query, _schema, out var _));
    }

    [TestMethod]
    public void MissingMaxDistance()
    {
        var query = @"{
            ""source"": {
                ""lon"": 0.0,
                ""lat"": 0.0
            },
            ""target"": {
                ""lon"": 0.0,
                ""lat"": 0.0
            },
            ""categories"": [
                {
                    ""keyword"": ""museum"",
                    ""filters"": {}
                }
            ],
            ""arrows"": []
        }";
        Assert.IsFalse(SearchController.ValidateQuery<PlacesQuery>(query, _schema, out var _));
    }

    [TestMethod]
    public void MaxDistanceBelowLowerBound()
    {
        var query = @"{
            ""source"": {
                ""lon"": 0.0,
                ""lat"": 0.0
            },
            ""target"": {
                ""lon"": 0.0,
                ""lat"": 0.0
            },
            ""maxDistance"": -1.0
            ""categories"": [
                {
                    ""keyword"": ""museum"",
                    ""filters"": {}
                }
            ],
            ""arrows"": []
        }";
        Assert.IsFalse(SearchController.ValidateQuery<PlacesQuery>(query, _schema, out var _));
    }

    [TestMethod]
    public void MaxDistanceAboveUpperBound()
    {
        var query = @"{
            ""source"": {
                ""lon"": 0.0,
                ""lat"": 0.0
            },
            ""target"": {
                ""lon"": 0.0,
                ""lat"": 0.0
            },
            ""maxDistance"": 30001.0,
            ""categories"": [
                {
                    ""keyword"": ""museum"",
                    ""filters"": {}
                }
            ],
            ""arrows"": []
        }";
        Assert.IsFalse(SearchController.ValidateQuery<PlacesQuery>(query, _schema, out var _));
    }

    [TestMethod]
    public void EmptyCategories()
    {
        var query = @"{
            ""source"": {
                ""lon"": 0.0,
                ""lat"": 0.0
            },
            ""target"": {
                ""lon"": 0.0,
                ""lat"": 0.0
            },
            ""maxDistance"": 5000.0,
            ""categories"": [],
            ""arrows"": []
        }";
        Assert.IsFalse(SearchController.ValidateQuery<PlacesQuery>(query, _schema, out var _));
    }

    [TestMethod]
    public void WellFormed()
    {
        var query = @"{
            ""source"": {
                ""lon"": 0.0,
                ""lat"": 0.0
            },
            ""target"": {
                ""lon"": 0.0,
                ""lat"": 0.0
            },
            ""maxDistance"": 5.0,
            ""categories"": [
                {
                    ""keyword"": ""museum"",
                    ""filters"": {}
                }
            ],
            ""arrows"": []
        }";
        Assert.IsTrue(SearchController.ValidateQuery<PlacesQuery>(query, _schema, out var _));
    }
}
