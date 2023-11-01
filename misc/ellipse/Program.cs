using System;
using System.IO;
using System.Linq;
using NetTopologySuite.Features;
using NetTopologySuite.Geometries;
using NetTopologySuite.IO;
using Newtonsoft.Json;
using SmartWalk.Core.Algorithms;
using SmartWalk.Core.Entities;

namespace SmartWalk.Experiment;

internal class Program
{
    static void Main(string[] args)
    {
        var f1 = new WgsPoint(14.4035264, 50.0884344);
        var f2 = new WgsPoint(14.4073961, 50.0909408);

        var distance = Math.Round(Spherical.HaversineDistance(f1, f2), 0);

        Console.WriteLine($"Distance between foci: {distance} meters.");

        var e = Spherical.BoundingEllipse(f1, f2, 450);

        var p = new Feature(
            new Polygon(new LinearRing(e.Select((point) => new Coordinate(point.lon, point.lat)).ToArray())),
            new AttributesTable());

        var s = new Feature(
            new Point(new Coordinate(f1.lon, f1.lat)),
            new AttributesTable() { { "marker-color", "#2aad27" } });

        var t = new Feature(
            new Point(new Coordinate(f2.lon, f2.lat)),
            new AttributesTable() { { "marker-color", "#cb2b3e" } });

        var c = new FeatureCollection() { p, s, t };

        var writer = new StringWriter();
        {
            using var jsonWriter = new JsonTextWriter(writer)
            {
                Formatting = Formatting.Indented
            };
            GeoJsonSerializer.Create().Serialize(jsonWriter, c);
        }
//      Console.WriteLine(writer);
        File.WriteAllText("./result.json", writer.ToString());
    }
}
