using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using MongoDB.Bson.Serialization.Attributes;

namespace SmartWalk.Model.Entities;

[BsonIgnoreExtraElements]
public sealed class PlaceAddress
{
    /// <example>Czech Republic</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string country { get; init; }

    /// <example>Prague</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string settlement { get; init; }

    /// <example>Prague 1</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string district { get; init; }

    /// <example>Malostranske namesti</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string place { get; init; }

    /// <example>2</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string house { get; init; }

    /// <example>118 00</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string postalCode { get; init; }
}

[BsonIgnoreExtraElements]
public sealed class PlaceSocialNetworks
{
    /// <example>https://www.facebook.com/facebookId</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string facebook { get; init; }

    /// <example>https://www.instagram.com/instagramId/</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string instagram { get; init; }

    /// <example>https://www.linkedin.com/in/linkedinId/</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string linkedin { get; init; }

    /// <example>https://www.pinterest.com/pinterestId/</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string pinterest { get; init; }

    /// <example>https://t.me/telegramId</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string telegram { get; init; }

    /// <example>https://twitter.com/twitterId</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string twitter { get; init; }

    /// <example>https://www.youtube.com/channel/youtubeId</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string youtube { get; init; }
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
    public List<WgsPoint> polygon { get; init; }

    /// <example>Detailed object description...</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string description { get; init; }

    /// <summary>
    /// Url of an image.
    /// </summary>
    /// <example>http://www.image.com/1.png</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string image { get; init; }

    /// <example>http://www.example.com/</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string website { get; init; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public PlaceAddress address { get; init; }

    /// <example>example@email.com</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string email { get; init; }

    /// <example>+420 123 456 789</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string phone { get; init; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public PlaceSocialNetworks socialNetworks { get; init; }

    /// <example>["100 CZK on weekdays", "200 CZK on weekends"]</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public List<string> charge { get; init; }

    /// <example>["Mo-Fr 09:00-18:00", "Sa-Su 08:00-12:00"]</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public List<string> openingHours { get; init; }

    /// <example>true</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? fee { get; init; }

    /// <example>true</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? delivery { get; init; }

    /// <example>true</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? drinkingWater { get; init; }

    /// <example>true</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? internetAccess { get; init; }

    /// <example>true</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? shower { get; init; }

    /// <example>true</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? smoking { get; init; }

    /// <example>true</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? takeaway { get; init; }

    /// <example>true</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? toilets { get; init; }

    /// <example>true</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public bool? wheelchair { get; init; }

    /// <example>10</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double? capacity { get; init; }

    /// <example>10</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double? elevation { get; init; }

    /// <example>21</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double? minimumAge { get; init; }

    /// <example>5</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double? rating { get; init; }

    /// <example>2023</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public double? year { get; init; }

    /// <example>["men", "women", "children"]</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public SortedSet<string> clothes { get; init; }

    /// <example>["czech", "oriental"]</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public SortedSet<string> cuisine { get; init; }

    /// <example>["catholic", "protestant"]</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public SortedSet<string> denomination { get; init; }

    /// <example>["amex", "cash", "mastercard"]</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public SortedSet<string> payment { get; init; }

    /// <example>["bike", "car", "equipment"]</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public SortedSet<string> rental { get; init; }
}

[BsonIgnoreExtraElements]
public sealed class PlaceLinked
{
    /// <example>Example</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string dbpedia { get; init; }

    /// <example>1</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string geonames { get; init; }

    /// <example>base&amp;id=1</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string mapycz { get; init; }

    /// <example>node/1</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string osm { get; init; }

    /// <example>Q1</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string wikidata { get; init; }

    /// <example>Example</example>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string yago { get; init; }
}

[BsonIgnoreExtraElements]
public sealed class ExtendedPlace : Place
{
    [Required]
    public PlaceLinked linked { get; init; }

    [Required]
    public PlaceAttributes attributes { get; init; }
}
