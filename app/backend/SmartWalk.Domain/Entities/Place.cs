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
    public string smartId { get; set; }

    [Required]
    public string name { get; set; }

    [Required]
    public WgsPoint location { get; set; }

    [Required]
    [MinLength(1)]
    public SortedSet<string> keywords { get; set; }

    [Required]
    public SortedSet<int> categories { get; set; } = new();
}
