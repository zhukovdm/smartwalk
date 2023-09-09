using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using MongoDB.Bson.Serialization.Attributes;

namespace SmartWalk.Domain.Entities;

[BsonIgnoreExtraElements]
public sealed class PlaceAddress
{
    /// <example>Czech Republic</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string country { get; set; }

    /// <example>Prague</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string settlement { get; set; }

    /// <example>Prague 1</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string district { get; set; }

    /// <example>Malostranske namesti</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string place { get; set; }

    /// <example>1</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string house { get; set; }

    /// <example>100 00</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string postalCode { get; set; }
}

[BsonIgnoreExtraElements]
public sealed class PlaceSocialNetworks
{
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string facebook { get; set; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string instagram { get; set; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string linkedin { get; set; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string pinterest { get; set; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string telegram { get; set; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string twitter { get; set; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string youtube { get; set; }
}

[BsonIgnoreExtraElements]
public sealed class PlaceAttributes
{
    /// <example>
    ///   [
    ///     {"lon":0.0, "lat":0.0},
    ///     {"lon":0.0, "lat":1.0},
    ///     {"lon":1.0, "lat":1.0},
    ///     {"lon":1.0, "lat":0.0},
    ///     {"lon":0.0, "lat":0.0}
    ///   ]
    /// </example>
    [MinLength(4)]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public List<WgsPoint> polygon { get; set; }

    /// <example>Detailed object description</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string description { get; set; }

    /// <example>http://www.image.com/1</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string image { get; set; }

    /// <example>http://www.example.com/</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string website { get; set; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public PlaceAddress address { get; set; }

    /// <example>example@email.com</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string email { get; set; }

    /// <example>+420 123 456 789</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string phone { get; set; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public PlaceSocialNetworks socialNetworks { get; set; }

    /// <example>100 CZK</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public List<string> charge { get; set; }

    /// <example>Mo-Fr 09:00-18:00</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public List<string> openingHours { get; set; }

    /// <example>true</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? fee { get; set; }

    /// <example>true</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? delivery { get; set; }

    /// <example>true</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? drinkingWater { get; set; }

    /// <example>true</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? internetAccess { get; set; }

    /// <example>true</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? shower { get; set; }

    /// <example>true</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? smoking { get; set; }

    /// <example>true</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? takeaway { get; set; }

    /// <example>true</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? toilets { get; set; }

    /// <example>true</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? wheelchair { get; set; }

    /// <example>10</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double? capacity { get; set; }

    /// <example>10</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double? elevation { get; set; }

    /// <example>21</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double? minimumAge { get; set; }

    /// <example>5</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double? rating { get; set; }

    /// <example>2023</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double? year { get; set; }

    /// <example>["men"]</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public SortedSet<string> clothes { get; set; }

    /// <example>["czech"]</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public SortedSet<string> cuisine { get; set; }

    /// <example>["catholic"]</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public SortedSet<string> denomination { get; set; }

    /// <example>["cash"]</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public SortedSet<string> payment { get; set; }

    /// <example>["bike"]</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public SortedSet<string> rental { get; set; }
}

[BsonIgnoreExtraElements]
public sealed class PlaceLinked
{
    /// <example>Example</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string dbpedia { get; set; }

    /// <example>1</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string geonames { get; set; }

    /// <example>base&amp;id=1</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string mapycz { get; set; }

    /// <example>node/1</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string osm { get; set; }

    /// <example>Q1</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string wikidata { get; set; }

    /// <example>Example</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string yago { get; set; }
}

[BsonIgnoreExtraElements]
public sealed class ExtendedPlace : Place
{
    public PlaceLinked linked { get; set; }

    public PlaceAttributes attributes { get; set; }
}
