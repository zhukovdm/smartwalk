using System.ComponentModel.DataAnnotations;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace SmartWalk.Api.Test;

/// <summary>
/// All queries are ultimately JSON objects. NJsonSchema internally uses
/// primitives from the `json.net` library. The behavior of it is sometimes
/// unexpected, and corner cases are tested by the class below. Even though
/// schema validates against the `C` type, these tests are applicable to all
/// user-defined classes.
/// </summary>
[TestClass]
public class GeneralValidationTests
{
    private class C
    {
        [Required]
        public int? secret { get; set; }
    }

    [TestMethod]
    public void EmptyQuery()
    {
        var serialization = "";
        Assert.IsFalse(SerializationValidator<C>.Validate(serialization, out var _));
    }

    [TestMethod]
    public void SerializationAsInvalidJsonString()
    {
        var serialization = "{1}";
        Assert.IsFalse(SerializationValidator<C>.Validate(serialization, out var _));
    }

    [TestMethod]
    public void SerializationAsEmptyObject()
    {
        var serialization = "{}";
        Assert.IsFalse(SerializationValidator<C>.Validate(serialization, out var _));
    }

    [TestMethod]
    public void SerializationAsEmptyArray()
    {
        var serialization = "[]";
        Assert.IsFalse(SerializationValidator<C>.Validate(serialization, out var _));
    }

    [TestMethod]
    public void SerializationAsEmptyString()
    {
        var serialization = "\"\"";
        Assert.IsFalse(SerializationValidator<C>.Validate(serialization, out var _));
    }

    [TestMethod]
    public void SerializationAsNumber()
    {
        var serialization = "0";
        Assert.IsFalse(SerializationValidator<C>.Validate(serialization, out var _));
    }

    [TestMethod]
    public void SerializationAsBoolean()
    {
        var serialization = "false";
        Assert.IsFalse(SerializationValidator<C>.Validate(serialization, out var _));
    }

    [TestMethod]
    public void SerializationAsNull()
    {
        var serialization = "null";
        Assert.IsFalse(SerializationValidator<C>.Validate(serialization, out var _));
    }

    [TestMethod]
    public void SerializationWithExtraProperty()
    {
        var serialization = "{\"secret\":0,\"extra\":0}";
        Assert.IsFalse(SerializationValidator<C>.Validate(serialization, out var _));
    }

    [TestMethod]
    public void WellFormedSerialization()
    {
        var serialization = "{\"secret\":0}";
        Assert.IsTrue(SerializationValidator<C>.Validate(serialization, out var _));
    }
}
