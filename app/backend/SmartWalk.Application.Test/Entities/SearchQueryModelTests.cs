using Microsoft.VisualStudio.TestTools.UnitTesting;
using SmartWalk.Application.Entities;
using SmartWalk.Application.Validators;
using SmartWalk.Core.Entities;

namespace SmartWalk.Application.Test;

[TestClass]
public class WebPointValidationTests
{
    [TestMethod]
    public void MissingLon()
    {
        var serialization = @"{
            ""lat"": 0.0
        }";
        Assert.IsFalse(SerializationValidator<WebPoint>.Validate(serialization, out var _));
    }

    [TestMethod]
    public void BelowLowerBoundLon()
    {
        var serialization = @"{
            ""lon"": -181.0,
            ""lat"": 0.0
        }";
        Assert.IsFalse(SerializationValidator<WebPoint>.Validate(serialization, out var _));
    }

    [TestMethod]
    public void AboveUpperBoundLon()
    {
        var serialization = @"{
            ""lon"": 181.0,
            ""lat"": 0.0
        }";
        Assert.IsFalse(SerializationValidator<WebPoint>.Validate(serialization, out var _));
    }

    [TestMethod]
    public void MissingLat()
    {
        var serialization = @"{
            ""lon"": 0.0
        }";
        Assert.IsFalse(SerializationValidator<WebPoint>.Validate(serialization, out var _));
    }

    [TestMethod]
    public void BelowLowerBoundLat()
    {
        var serialization = @"{
            ""lon"": 0.0,
            ""lat"": -86.0
        }";
        Assert.IsFalse(SerializationValidator<WebPoint>.Validate(serialization, out var _));
    }

    [TestMethod]
    public void AboveUpperBoundLat()
    {
        var serialization = @"{
            ""lon"": 0.0,
            ""lat"": 86.0
        }";
        Assert.IsFalse(SerializationValidator<WebPoint>.Validate(serialization, out var _));
    }

    [TestMethod]
    public void WellFormed()
    {
        var serialization = @"{
            ""lon"": 0.0,
            ""lat"": 0.0
        }";
        Assert.IsTrue(SerializationValidator<WebPoint>.Validate(serialization, out var _));
    }
}

[TestClass]
public class WebPrecedenceEdgeValidationTests
{
    [TestMethod]
    public void MissingFr()
    {
        var serialization = @"{
            ""to"": 0
        }";
        Assert.IsFalse(SerializationValidator<WebPrecedenceEdge>.Validate(serialization, out var _));
    }

    [TestMethod]
    public void BelowLowerBoundFr()
    {
        var serialization = @"{
            ""fr"": -1,
            ""to"": 0
        }";
        Assert.IsFalse(SerializationValidator<WebPrecedenceEdge>.Validate(serialization, out var _));
    }

    [TestMethod]
    public void MissingTo()
    {
        var serialization = @"{
            ""fr"": 0
        }";
        Assert.IsFalse(SerializationValidator<WebPrecedenceEdge>.Validate(serialization, out var _));
    }

    [TestMethod]
    public void BelowLowerBoundTo()
    {
        var serialization = @"{
            ""fr"": 0,
            ""to"": -1
        }";
        Assert.IsFalse(SerializationValidator<WebPrecedenceEdge>.Validate(serialization, out var _));
    }

    [TestMethod]
    public void WellFormed()
    {
        var serialization = @"{
            ""fr"": 0,
            ""to"": 0
        }";
        Assert.IsTrue(SerializationValidator<WebPrecedenceEdge>.Validate(serialization, out var _));
    }
}

[TestClass]
public class AttributeFilterNumericValidationTests
{
    [TestMethod]
    public void MissingMin()
    {
        var serialization = @"{
            ""max"": 0.0
        }";
        Assert.IsFalse(SerializationValidator<AttributeFilterNumeric>.Validate(serialization, out var _));
    }

    [TestMethod]
    public void MissingMax()
    {
        var serialization = @"{
            ""min"": 0.0
        }";
        Assert.IsFalse(SerializationValidator<AttributeFilterNumeric>.Validate(serialization, out var _));
    }

    [TestMethod]
    public void WellFormed()
    {
        var serialization = @"{
            ""min"": 0.0,
            ""max"": 0.0
        }";
        Assert.IsTrue(SerializationValidator<AttributeFilterNumeric>.Validate(serialization, out var _));
    }
}

[TestClass]
public class AttributeFilterCollectValidationTests
{
    [TestMethod]
    public void MissingInc()
    {
        var serialization = @"{
            ""exc"": [""e""]
        }";
        Assert.IsFalse(SerializationValidator<AttributeFilterCollect>.Validate(serialization, out var _));
    }

    [TestMethod]
    public void MissingExc()
    {
        var serialization = @"{
            ""inc"": [""i""]
        }";
        Assert.IsFalse(SerializationValidator<AttributeFilterCollect>.Validate(serialization, out var _));
    }

    [TestMethod]
    public void WellFormed()
    {
        var serialization = @"{
            ""inc"": [""i""],
            ""exc"": [""e""]
        }";
        Assert.IsTrue(SerializationValidator<AttributeFilterCollect>.Validate(serialization, out var _));
    }
}

[TestClass]
public class CategoryValidationTests
{
    [TestMethod]
    public void MissingKeyword()
    {
        var serialization = @"{
            ""filters"": {}
        }";
        Assert.IsFalse(SerializationValidator<Category>.Validate(serialization, out var _));
    }

    [TestMethod]
    public void EmptyKeyword()
    {
        var serialization = @"{
            ""keyword"": """",
            ""filters"": {}
        }";
        Assert.IsFalse(SerializationValidator<Category>.Validate(serialization, out var _));
    }

    [TestMethod]
    public void MissingFilters()
    {
        var serialization = @"{
            ""keyword"": ""abc""
        }";
        Assert.IsFalse(SerializationValidator<Category>.Validate(serialization, out var _));
    }

    [TestMethod]
    public void WellFormed()
    {
        var serialization = @"{
            ""keyword"": ""museum"",
            ""filters"": {}
        }";
        Assert.IsTrue(SerializationValidator<Category>.Validate(serialization, out var _));
    }
}

[TestClass]
public class DirecsQueryValidationTests
{
    [TestMethod]
    public void MissingWaypoints()
    {
        var serialization = @"{}";
        Assert.IsFalse(SerializationValidator<ConstrainedSearchDirecsQuery>.Validate(serialization, out var _));
    }

    [TestMethod]
    public void TooShortWaypointSequence()
    {
        var serialization = @"{
            ""waypoints"":[
                { ""lon"": 0.0, ""lat"": 0.0 }
            ]
        }";
        Assert.IsFalse(SerializationValidator<ConstrainedSearchDirecsQuery>.Validate(serialization, out var _));
    }

    [TestMethod]
    public void WellFormed()
    {
        var serialization = @"{
            ""waypoints"":[
                { ""lon"": 0.0, ""lat"": 0.0 },
                { ""lon"": 1.0, ""lat"": 1.0 }
            ]
        }";
        Assert.IsTrue(SerializationValidator<ConstrainedSearchDirecsQuery>.Validate(serialization, out var _));
    }
}

[TestClass]
public class PlacesQueryValidationTests
{
    [TestMethod]
    public void MissingCenter()
    {
        var serialization = @"{
            ""radius"": 0,
            ""categories"": []
        }";
        Assert.IsFalse(SerializationValidator<ConstrainedSearchPlacesQuery>.Validate(serialization, out var _));
    }

    [TestMethod]
    public void MissingRadius()
    {
        var serialization = @"{
            ""center"": {
                ""lon"": 0.0,
                ""lat"": 0.0
            },
            ""categories"": []
        }";
        Assert.IsFalse(SerializationValidator<ConstrainedSearchPlacesQuery>.Validate(serialization, out var _));
    }

    [TestMethod]
    public void RadiusBelowLowerBound()
    {
        var serialization = @"{
            ""center"": {
                ""lon"": 0.0,
                ""lat"": 0.0
            },
            ""radius"": -1.0,
            ""categories"": []
        }";
        Assert.IsFalse(SerializationValidator<ConstrainedSearchPlacesQuery>.Validate(serialization, out var _));
    }

    [TestMethod]
    public void RadiusAboveUpperBound()
    {
        var serialization = @"{
            ""center"": {
                ""lon"": 0.0,
                ""lat"": 0.0
            },
            ""radius"": 15001.0,
            ""categories"": []
        }";
        Assert.IsFalse(SerializationValidator<ConstrainedSearchPlacesQuery>.Validate(serialization, out var _));
    }

    [TestMethod]
    public void MissingCategories()
    {
        var serialization = @"{
            ""center"": {
                ""lon"": 0.0,
                ""lat"": 0.0
            },
            ""radius"": 0
        }";
        Assert.IsFalse(SerializationValidator<ConstrainedSearchPlacesQuery>.Validate(serialization, out var _));
    }

    [TestMethod]
    public void WellFormedWithEmptyCategories()
    {
        var serialization = @"{
            ""center"": {
                ""lon"": 0.0,
                ""lat"": 0.0
            },
            ""radius"": 3000,
            ""categories"": []
        }";
        Assert.IsTrue(SerializationValidator<ConstrainedSearchPlacesQuery>.Validate(serialization, out var _));
    }

    [TestMethod]
    public void WellFormedWithNonEmptyCategories()
    {
        var serialization = @"{
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
        Assert.IsTrue(SerializationValidator<ConstrainedSearchPlacesQuery>.Validate(serialization, out var _));
    }
}

[TestClass]
public class RoutesQueryValidationTests
{
    [TestMethod]
    public void MissingSource()
    {
        var serialization = @"{
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
        Assert.IsFalse(SerializationValidator<ConstrainedSearchRoutesQuery>.Validate(serialization, out var _));
    }

    [TestMethod]
    public void MissingTarget()
    {
        var serialization = @"{
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
        Assert.IsFalse(SerializationValidator<ConstrainedSearchRoutesQuery>.Validate(serialization, out var _));
    }

    [TestMethod]
    public void MissingMaxDistance()
    {
        var serialization = @"{
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
        Assert.IsFalse(SerializationValidator<ConstrainedSearchRoutesQuery>.Validate(serialization, out var _));
    }

    [TestMethod]
    public void MaxDistanceBelowLowerBound()
    {
        var serialization = @"{
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
        Assert.IsFalse(SerializationValidator<ConstrainedSearchRoutesQuery>.Validate(serialization, out var _));
    }

    [TestMethod]
    public void MaxDistanceAboveUpperBound()
    {
        var serialization = @"{
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
        Assert.IsFalse(SerializationValidator<ConstrainedSearchRoutesQuery>.Validate(serialization, out var _));
    }

    [TestMethod]
    public void EmptyCategories()
    {
        var serialization = @"{
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
        Assert.IsFalse(SerializationValidator<ConstrainedSearchRoutesQuery>.Validate(serialization, out var _));
    }

    [TestMethod]
    public void WellFormed()
    {
        var serialization = @"{
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
        Assert.IsTrue(SerializationValidator<ConstrainedSearchRoutesQuery>.Validate(serialization, out var _));
    }
}
