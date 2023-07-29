using OsmSharp.Tags;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace osm;

internal static class AttributeExtractor
{
    private sealed class Item
    {
        public string value { get; set; }
    }

    private static readonly SortedSet<string>
        _clothes, _cuisine, _denomination, _rental;

    private static SortedSet<string> GetCollection(string file)
    {
        var json = File.ReadAllText(string.Join(Path.DirectorySeparatorChar, new[] { Constants.ASSETS_BASE_ADDR, "taginfo", file + ".json" }));
        return new(JsonSerializer.Deserialize<List<Item>>(json).Select(i => i.value));
    }

    static AttributeExtractor()
    {
        _clothes = GetCollection("clothes");
        _cuisine = GetCollection("cuisine");
        _denomination = GetCollection("denomination");
        _rental = GetCollection("rental");
    }

    // supporting functions

    private static string Http(string str)
        => Regex.IsMatch(str, @"^https?://") ? str : "https://" + str;

    private static List<string> Divide(string s)
        => s.Split(';', StringSplitOptions.RemoveEmptyEntries).Select(s => s.Trim()).ToList();

    private static bool IsNonTrivialStringSequence(List<string> seq)
    {
        var result = true;

        if (seq is null || seq.Count == 0) { return !result; }

        foreach (var c in seq) { result &= Verifier.IsNonTrivialString(c); }

        return result;
    }

    private static bool IsStandardUri(string s)
    {
        return Uri.TryCreate(s, UriKind.Absolute, out var uri) && uri.IsAbsoluteUri
            && (uri.Scheme == Uri.UriSchemeHttp || uri.Scheme == Uri.UriSchemeHttps);
    }

    private static bool TryConstructWikipedia(string str, out string uri)
    {
        uri = null;

        if (Regex.IsMatch(str, @"^[a-z]{2}:[A-Za-z0-9].*$"))
        {
            var lst = str.Split(new char[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);

            var pfx = lst[0].AsSpan(0, 2).ToString();
            var sfx = lst[0].AsSpan(3).ToString();

            lst[0] = sfx;

            uri = "https://"
                + pfx
                + ".wikipedia.org/wiki/"
                + string.Join('_', lst);

            return IsStandardUri(uri);
        }

        return false;
    }

    private static void Accommodate(TagsCollectionBase tags, Attributes attributes, string[] lst, Action<string> act)
    {
        foreach (var item in lst)
        {
            if (tags.TryGetValue(item, out var v) && Verifier.IsNonTrivialString(v))
            {
                attributes.address = attributes.address ?? new();
                act.Invoke(v);
                return;
            }
        }
    }

    private static bool IsPhone(string s)
    {
        var _base = "+0123456789";
        var _spec = " -()[]";
        var _comp = _base + _spec;

        bool predicate(string str)
        {
            return str is not null
                && str.Length >= 5 && str.Length <= 30
                && str.All(l => _comp.Contains(l));
        }

        string filter(string str)
        {
            var buf = new StringBuilder();

            foreach (var ch in str)
            {
                if (!_spec.Contains(ch)) { buf.Append(ch); }
            }

            return buf.ToString();
        }

        return predicate(s)
            && Regex.IsMatch(filter(s), @"^\+?\d{4,20}$");
    }

    private static bool TryExtractPositiveInteger(string s, out int num)
    {
        num = 0;
        int cur = 0;

        for (int i = 0; i < s.Length; ++i)
        {
            if (char.IsDigit(s[i]))
            {
                cur = cur * 10 + int.Parse(s[i].ToString());
            }

            else
            {
                num = (cur > 0) ? cur : num;
                cur = 0;
            }
        }

        num = (cur > 0) ? cur : num;

        return num > 0;
    }

    // extractors for a specific feature

    private static void Image(TagsCollectionBase tags, Attributes attributes)
    {
        if (tags.TryGetValue("image", out var v) && IsStandardUri(Http(v)))
        {
            attributes.image = Http(v);
        }
    }

    private static void Website(TagsCollectionBase tags, Attributes attributes)
    {
        string[] ks;

        ks = new[] { "contact:website", "website", "url" };

        foreach (var k in ks)
        {
            if (tags.TryGetValue(k, out var v) && IsStandardUri(Http(v)))
            {
                attributes.website = Http(v);
                return;
            }
        }

        {
            if (tags.TryGetValue("wikipedia", out var v) && TryConstructWikipedia(v, out var u))
            {
                attributes.website = u;
            }
        }
    }

    private static void Address(TagsCollectionBase tags, Attributes attributes)
    {
        var _co = new[] { "addr:country" };
        var _se = new[] { "addr:city", "addr:province", "addr:county", "addr:hamlet" };
        var _di = new[] { "addr:district", "addr:subdistrict", "addr:suburb" };
        var _pl = new[] { "addr:street", "addr:place" };
        var _ho = new[] { "addr:housenumber", "addr:conscriptionnumber" };
        var _po = new[] { "addr:postcode", "addr:postbox" };

        Accommodate(tags, attributes, _co, (string co) => { attributes.address.country = co; });
        Accommodate(tags, attributes, _se, (string se) => { attributes.address.settlement = se; });
        Accommodate(tags, attributes, _di, (string di) => { attributes.address.district = di; });
        Accommodate(tags, attributes, _pl, (string pl) => { attributes.address.place = pl; });
        Accommodate(tags, attributes, _ho, (string ho) => { attributes.address.house = ho; });
        Accommodate(tags, attributes, _po, (string po) => { attributes.address.postalCode = po; });
    }

    private static void Email(TagsCollectionBase tags, Attributes attributes)
    {
        var ks = new string[] { "contact:email", "email" };

        foreach (var k in ks)
        {
            if (tags.TryGetValue(k, out var v) && MailAddress.TryCreate(v, out _))
            {
                attributes.email = v;
                return;
            }
        }
    }

    private static void Phone(TagsCollectionBase tags, Attributes attributes)
    {
        var ks = new string[] { "contact:phone", "phone", "contact:mobile" };

        foreach (var k in ks)
        {
            if (tags.TryGetValue(k, out var v) && IsPhone(v))
            {
                attributes.phone = v;
                return;
            }
        }
    }

    private static void Fee(TagsCollectionBase tags, Attributes attributes)
    {
        var ks = new string[] { "fee", "toll" };
        var vs = new SortedSet<string> { "no" };

        foreach (var k in ks)
        {
            if (tags.TryGetValue(k, out var v))
            {
                attributes.fee = vs.Contains(v) ? false : true;
                return;
            }
        }
    }

    private static void Delivery(TagsCollectionBase tags, Attributes attributes)
    {
        var vs = new SortedSet<string> { "yes", "only" };

        if (tags.TryGetValue("delivery", out var v))
        {
            attributes.delivery = vs.Contains(v) ? true : false;
        }
    }

    private static void DrinkingWater(TagsCollectionBase tags, Place place)
    {
        var ks = new string[] { "drinking_water", "drinking_water:legal", "drinking_water:refill" };
        var vs = new SortedSet<string>() { "yes" };

        foreach (var k in ks)
        {
            if (tags.TryGetValue(k, out var v))
            {
                if (vs.Contains(v)) { place.keywords.Add("drinking water"); }
                place.attributes.drinkingWater = vs.Contains(v) ? true : false;
                return;
            }
        }
    }

    private static void InternetAccess(TagsCollectionBase tags, Place place)
    {
        var k = "internet_access";
        var vs = new SortedSet<string>() { "wlan", "yes", "terminal", "wired", "wifi" };

        if (tags.TryGetValue(k, out var v))
        {
            if (vs.Contains(v)) { place.keywords.Add("internet access"); }
            place.attributes.internetAccess = vs.Contains(v) ? true : false;
        }
    }

    private static void Shower(TagsCollectionBase tags, Attributes attributes)
    {
        var vs = new SortedSet<string>() { "yes", "hot", "outdoor" };

        if (tags.TryGetValue("shower", out var v))
        {
            attributes.shower = vs.Contains(v) ? true : false;
        }
    }

    private static void Smoking(TagsCollectionBase tags, Attributes attributes)
    {
        var ks = new[] { "smoking", "smoking:outside" };
        var vs = new SortedSet<string>() { "yes", "outside", "isolated", "separated", "outdoor", "dedicated", "designated" };

        foreach (var k in ks)
        {
            if (tags.TryGetValue(k, out var v))
            {
                attributes.smoking = vs.Contains(v) ? true : false;
                return;
            }
        }
    }

    private static void Takeaway(TagsCollectionBase tags, Attributes attributes)
    {
        var vs = new SortedSet<string> { "yes", "only" };

        if (tags.TryGetValue("takeaway", out var v))
        {
            attributes.takeaway = vs.Contains(v) ? true : false;
        }
    }

    private static void Toilets(TagsCollectionBase tags, Attributes attributes)
    {
        var vs = new SortedSet<string>() { "yes" };

        if (tags.TryGetValue("toilets", out var v))
        {
            attributes.toilets = vs.Contains(v) ? true : false;
        }
    }

    private static void Wheelchair(TagsCollectionBase tags, Attributes attributes)
    {
        var vs = new SortedSet<string>() { "yes" };

        if (tags.TryGetValue("wheelchair", out var v))
        {
            attributes.wheelchair = vs.Contains(v) ? true : false;
        }
    }

    private static void Year(TagsCollectionBase tags, Attributes attributes)
    {
        var ks = new string[] { "year_of_construction", "building:year_built", "year", "construction_year", "year_built", "building:year", "year_completed", "build_year" };

        foreach (var k in ks)
        {
            if (tags.TryGetValue(k, out var v) && int.TryParse(v, out var n))
            {
                attributes.year = n;
                return;
            }
        }
    }

    private static void Rating(TagsCollectionBase tags, Attributes attributes)
    {
        if (tags.TryGetValue("stars", out var v) && int.TryParse(v, out var n) && n >= 0)
        {
            attributes.rating = n;
        }
    }

    private static void Capacity(TagsCollectionBase tags, Attributes attributes)
    {
        var ks = new string[] { "capacity", "seats" };

        foreach (var k in ks)
        {
            if (tags.TryGetValue(k, out var v) && int.TryParse(v, out var n) && n >= 0)
            {
                attributes.capacity = n;
                return;
            }
        }

        {
            if (tags.TryGetValue("capacity:persons", out var v) && TryExtractPositiveInteger(v, out var p))
            {
                attributes.capacity = p;
            }
        }
    }

    private static void Elevation(TagsCollectionBase tags, Attributes attributes)
    {
        var ks = new string[] { "ele", "top_ele", "elevation" };

        foreach (var k in ks)
        {
            if (tags.TryGetValue(k, out var v) && double.TryParse(v, out var n))
            {
                attributes.elevation = n;
                return;
            }
        }
    }

    private static void MinimumAge(TagsCollectionBase tags, Attributes attributes)
    {
        if (tags.TryGetValue("min_age", out var v) && int.TryParse(v, out var n) && n >= 0)
        {
            attributes.minimumAge = n;
        }
    }

    private static void Charge(TagsCollectionBase tags, Attributes attributes)
    {
        if (tags.TryGetValue("charge", out var v))
        {
            var vs = Divide(v);

            if (IsNonTrivialStringSequence(vs))
            {
                attributes.charge = vs;
                return;
            }
        }
    }

    private static void OpeningHours(TagsCollectionBase tags, Attributes attributes)
    {
        var ks = new string[] { "opening_hours", "service_times", };

        foreach (var k in ks)
        {
            if (tags.TryGetValue(k, out var v))
            {
                var vs = Divide(v);

                if (IsNonTrivialStringSequence(vs))
                {
                    attributes.openingHours = vs;
                    return;
                }
            }
        }
    }

    private static void Clothes(TagsCollectionBase tags, Attributes attributes)
    {
        if (tags.TryGetValue("clothes", out var v))
        {
            SortedSet<string> res = new(Divide(v).Select(v => Converter.SnakeToKeyword(v)).Where(item => _clothes.Contains(item)));
            attributes.clothes = (res.Count > 0) ? res : null;
        }
    }

    private static void Cuisine(TagsCollectionBase tags, Attributes attributes)
    {
        var res = new SortedSet<string>();

        string v;
        var vs = new SortedSet<string>() { "yes", "only", "limited" };

        if (tags.TryGetValue("cuisine", out v))
        {
            var items = Divide(v).Select(v => Converter.SnakeToKeyword(v)).Where(item => _cuisine.Contains(item));
            foreach (var item in items) { res.Add(item); }
        }

        if (tags.TryGetValue("diet:vegan", out v) && vs.Contains(v)) { res.Add("vegan"); }

        if (tags.TryGetValue("diet:vegetarian", out v) && vs.Contains(v)) { res.Add("vegetarian"); }

        if (res.Count > 0) { attributes.cuisine = res; }
    }

    private static void Denomination(TagsCollectionBase tags, Attributes attributes)
    {
        if (tags.TryGetValue("denomination", out var v))
        {
            SortedSet<string> res = new(Divide(v).Select(v => Converter.SnakeToKeyword(v)).Where(item => _denomination.Contains(item)));
            attributes.denomination = (res.Count > 0) ? res : null;
        }
    }

    private static void Rental(TagsCollectionBase tags, Attributes attributes)
    {
        if (tags.TryGetValue("rental", out var v))
        {
            SortedSet<string> res = new(Divide(v).Select(v => Converter.SnakeToKeyword(v)).Where(item => _rental.Contains(item)));
            attributes.rental = (res.Count > 0) ? res : null;
        }
    }

    /// <summary>
    /// Payment extraction based on taginfo statistics.
    /// 
    /// <list>
    /// <item>https://taginfo.openstreetmap.org/search?q=payment#keys</item>
    /// </list>
    /// </summary>
    private static void Payment(TagsCollectionBase tags, Attributes attributes)
    {
        var res = new SortedSet<string>();

        var ks = tags.Select(i => i.Key).Where(k => k.StartsWith("payment:"));
        var vs = new SortedSet<string>() { "yes", "only" };

        var ts = new SortedSet<string>()
        {
            "cash",
            "credit cards",
            "visa",
            "debit cards",
            "mastercard",
            "coins",
            "notes",
            "maestro",
            "contactless",
            "american express",
            "cards",
            "visa electron",
            "electronic purses",
            "ep easycard",
            "ep ipass",
            "telephone cards",
            "jcb",
            "discover card",
            "diners club",
            "girocard",
            "visa debit",
            "unionpay",
            "cryptocurrencies",
            "cheque",
            "alipay",
            "wechat",
            "apple pay",
            "lightning",
            "onchain",
            "ep geldkarte",
            "membership card",
            "v pay",
            "google pay",
            "paypal",
            "bitcoin",
            "sodexo"
        };

        foreach (var k in ks)
        {
            if (tags.TryGetValue(k, out var v) && vs.Contains(v))
            {
                var cand = Converter.SnakeToKeyword(k.Substring(8));
                if (ts.Contains(cand)) { res.Add(cand); }
            }
        }

        if (res.Count > 0) { attributes.payment = res; }
    }

    // main routine

    public static void Extract(TagsCollectionBase tags, Place place)
    {
        //Name(tags, place.attributes);
        //Polygon(tags, place.attributes);
        Image(tags, place.attributes);
        Website(tags, place.attributes);
        Address(tags, place.attributes);
        Payment(tags, place.attributes);
        Email(tags, place.attributes);
        Phone(tags, place.attributes);
        Delivery(tags, place.attributes);
        DrinkingWater(tags, place);
        InternetAccess(tags, place);
        Shower(tags, place.attributes);
        Smoking(tags, place.attributes);
        Takeaway(tags, place.attributes);
        Toilets(tags, place.attributes);
        Wheelchair(tags, place.attributes);
        Year(tags, place.attributes);
        Rating(tags, place.attributes);
        Capacity(tags, place.attributes);
        Elevation(tags, place.attributes);
        MinimumAge(tags, place.attributes);
        Fee(tags, place.attributes);
        Charge(tags, place.attributes);
        OpeningHours(tags, place.attributes);
        Clothes(tags, place.attributes);
        Cuisine(tags, place.attributes);
        Rental(tags, place.attributes);
    }
}
