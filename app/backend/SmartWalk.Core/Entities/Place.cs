using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace SmartWalk.Core.Entities;

[BsonIgnoreExtraElements]
public class Place
{
    /// <example>64c91f8359914b93b23b01d9</example>
    [BsonId]
    [Required]
    [BsonRepresentation(BsonType.ObjectId)]
    public string smartId { get; init; }

    /// <example>Noname</example>
    [Required]
    public string name { get; init; }

    [Required]
    public WgsPoint location { get; init; }

    /// <example>["a", "b", "c"]</example>
    [Required]
    [MinLength(1)]
    public SortedSet<string> keywords { get; init; }

    /// <example>[0, 1, 2]</example>
    [Required]
    public SortedSet<int> categories { get; init; } = new();
}
