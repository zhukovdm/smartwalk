using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Nest;

namespace SmartWalk.Domain.Entities;

[BsonIgnoreExtraElements]
[ElasticsearchType(IdProperty = nameof(smartId))]
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

    /// <example>{"lon":0.0,"lat":0.0}</example>
    [Required]
    public WgsPoint location { get; init; }

    /// <example>["keyword"]</example>
    [Required]
    [MinLength(1)]
    public SortedSet<string> keywords { get; init; }

    /// <example>[0, 1]</example>
    [Required]
    public SortedSet<int> categories { get; init; } = new();
}
