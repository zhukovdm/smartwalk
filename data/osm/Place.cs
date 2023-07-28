using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;

namespace osm;

internal sealed class Point
{
    public double lon { get; set; }

    public double lat { get; set; }
}

internal sealed class GeoJsonPoint
{
    public GeoJsonPoint(double lon, double lat) { coordinates = new() { lon, lat }; }

    public string type { get; set; } = "Point";

    public List<double> coordinates { get; set; }
}

internal sealed class Address
{
    [BsonIgnoreIfNull]
    public string country { get; set; }

    [BsonIgnoreIfNull]
    public string settlement { get; set; }

    [BsonIgnoreIfNull]
    public string district { get; set; }

    [BsonIgnoreIfNull]
    public string place { get; set; }

    [BsonIgnoreIfNull]
    public string house { get; set; }

    [BsonIgnoreIfNull]
    public string postalCode { get; set; }
}

internal sealed class Attributes
{
    [BsonIgnoreIfNull]
    public List<Point> polygon { get; set; }

    [BsonIgnoreIfNull]
    public string image { get; set; }

    [BsonIgnoreIfNull]
    public string website { get; set; }

    [BsonIgnoreIfNull]
    public Address address { get; set; }

    [BsonIgnoreIfNull]
    public string email { get; set; }

    [BsonIgnoreIfNull]
    public string phone { get; set; }

    [BsonIgnoreIfNull]
    public List<string> charge { get; set; }

    [BsonIgnoreIfNull]
    public List<string> openingHours { get; set; }

    [BsonIgnoreIfNull]
    public bool? fee { get; set; }

    [BsonIgnoreIfNull]
    public bool? delivery { get; set; }

    [BsonIgnoreIfNull]
    public bool? drinkingWater { get; set; }

    [BsonIgnoreIfNull]
    public bool? internetAccess { get; set; }

    [BsonIgnoreIfNull]
    public bool? shower { get; set; }

    [BsonIgnoreIfNull]
    public bool? smoking { get; set; }

    [BsonIgnoreIfNull]
    public bool? takeaway { get; set; }

    [BsonIgnoreIfNull]
    public bool? toilets { get; set; }

    [BsonIgnoreIfNull]
    public bool? wheelchair { get; set; }

    [BsonIgnoreIfNull]
    public double? year { get; set; }

    [BsonIgnoreIfNull]
    public double? rating { get; set; }

    [BsonIgnoreIfNull]
    public double? capacity { get; set; }

    [BsonIgnoreIfNull]
    public double? elevation { get; set; }

    [BsonIgnoreIfNull]
    public double? minimumAge { get; set; }

    [BsonIgnoreIfNull]
    public SortedSet<string> rental { get; set; }

    [BsonIgnoreIfNull]
    public SortedSet<string> clothes { get; set; }

    [BsonIgnoreIfNull]
    public SortedSet<string> cuisine { get; set; }

    [BsonIgnoreIfNull]
    public SortedSet<string> payment { get; set; }
}

internal sealed class Linked
{
    [BsonIgnoreIfNull]
    public string osm { get; set; }

    [BsonIgnoreIfNull]
    public string wikidata { get; set; }
}

internal sealed class Place
{
    public string name { get; set; }

    public GeoJsonPoint location { get; set; }

    public SortedSet<string> keywords { get; set; } = new();

    public Linked linked { get; set; } = new();

    public Attributes attributes { get; set; } = new();
}
