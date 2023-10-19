using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using MongoDB.Bson.Serialization.Attributes;

using CollectBound = System.Collections.Generic.List<string>;

namespace SmartWalk.Core.Entities;

public sealed class NumericBound
{
    [Required]
    public double min { get; init; }

    [Required]
    public double max { get; init; }
}

[BsonIgnoreExtraElements]
public sealed class NumericBounds
{
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public NumericBound capacity { get; init; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public NumericBound elevation { get; init; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public NumericBound minimumAge { get; init; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public NumericBound rating { get; init; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public NumericBound year { get; init; }
}

public class CollectBounds
{
    /// <example>["men"]</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public CollectBound clothes { get; init; }

    /// <example>["czech"]</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public CollectBound cuisine { get; init; }

    /// <example>["catholic"]</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public CollectBound denomination { get; init; }

    /// <example>["cash"]</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public CollectBound payment { get; init; }

    /// <example>["bike"]</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public CollectBound rental { get; init; }
}

public class KeywordAdviceItem
{
    /// <example>museum</example>
    [Required]
    public string keyword { get; init; }

    /// <example>["name", "openingHours"]</example>
    [Required]
    public List<string> attributeList { get; init; }

    [Required]
    public NumericBounds numericBounds { get; init; }

    [Required]
    public CollectBounds collectBounds { get; init; }
}
