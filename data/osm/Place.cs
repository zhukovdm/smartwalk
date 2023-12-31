using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;

namespace osm;

internal sealed class Point
{
    public double lon { get; init; }

    public double lat { get; init; }
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

internal sealed class SocialNetworks
{
    [BsonIgnoreIfNull]
    public string facebook { get; set; }

    [BsonIgnoreIfNull]
    public string instagram { get; set; }

    [BsonIgnoreIfNull]
    public string linkedin { get; set; }

    [BsonIgnoreIfNull]
    public string pinterest { get; set; }

    [BsonIgnoreIfNull]
    public string telegram { get; set; }

    [BsonIgnoreIfNull]
    public string twitter { get; set; }

    [BsonIgnoreIfNull]
    public string youtube { get; set; }
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
    public SocialNetworks socialNetworks { get; set; }

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
    public double? capacity { get; set; }

    [BsonIgnoreIfNull]
    public double? elevation { get; set; }

    [BsonIgnoreIfNull]
    public double? minimumAge { get; set; }

    [BsonIgnoreIfNull]
    public double? rating { get; set; }

    [BsonIgnoreIfNull]
    public double? year { get; set; }

    [BsonIgnoreIfNull]
    public SortedSet<string> clothes { get; set; }

    [BsonIgnoreIfNull]
    public SortedSet<string> cuisine { get; set; }

    [BsonIgnoreIfNull]
    public SortedSet<string> denomination { get; set; }

    [BsonIgnoreIfNull]
    public SortedSet<string> payment { get; set; }

    [BsonIgnoreIfNull]
    public SortedSet<string> rental { get; set; }
}

internal sealed class Linked
{
    [BsonIgnoreIfNull]
    public string osm { get; set; }

    [BsonIgnoreIfNull]
    public string wikidata { get; set; }
}

internal sealed class Metadata
{
    [BsonIgnoreIfNull]
    public string created { get; set; }

    [BsonIgnoreIfNull]
    public string updated { get; set; }
}

internal sealed class Place
{
    public string name { get; set; }

    public Point location { get; set; }

    public SortedSet<string> keywords { get; set; } = new();

    public Linked linked { get; set; } = new();

    public Metadata metadata { get; set; } = new();

    public Attributes attributes { get; set; } = new();
}
