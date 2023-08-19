using System;
using System.Collections.Generic;
using System.Linq;
using SmartWalk.Domain.Entities;
using NetTopologySuite.Geometries;
using NetTopologySuite.Geometries.Utilities;
using NetTopologySuite.Utilities;

namespace SmartWalk.Core.Algorithms;

public static class Spherical
{
    private static readonly double _deg2rad = Math.PI / 180.0;
    private static readonly double _rad2deg = 180.0 / Math.PI;

    /// <summary>
    /// Sphere radius used by Web Mercator projection (semi-major axis).
    /// </summary>
    private static readonly double _earthRadius = 6_378_137.0;

    /// <summary>
    /// Convert degrees to radians.
    /// </summary>
    private static double DegToRad(double deg) => deg * _deg2rad;

    /// <summary>
    /// Convert radians to degrees.
    /// </summary>
    private static double RadToDeg(double rad) => rad * _rad2deg;

    /// <summary>
    /// The ratio r / R, where R is the Earth radius and r is the radius of
    /// a parallel at that latitude. The costs of radians have the same ratio
    /// because of the definition of a radian.
    /// </summary>
    /// <param name="lat">Latitude in radians.</param>
    private static double LonRadCost(double lat) => Math.Cos(lat);

    /// <summary>
    /// Length of one radian along longitude at a given latitude.
    /// </summary>
    /// <param name="lat">Latitude in radians.</param>
    /// <returns>Length in meters.</returns>
    private static double LonRadLeng(double lat) => _earthRadius * LonRadCost(lat);

    /// <summary>
    /// Weight of one latitudinal radian at a certain latitude.
    /// </summary>
    /// <param name="lat">Latitude in radians.</param>
    private static double LatRadCost(double lat) => 1.0;

    /// <summary>
    /// Length of one latitudinal radian at a certain latitude.
    /// </summary>
    /// <param name="lat">Latitude in radians.</param>
    /// <returns>Length in meters.</returns>
    private static double LatRadLeng(double lat) => _earthRadius * LatRadCost(lat);

    /// <summary>
    /// Approximate the midpoint between two points on a sphere (use <b>ONLY</b> for small distances).
    /// </summary>
    public static WgsPoint Midpoint(WgsPoint p1, WgsPoint p2)
        => new((p1.lon + p2.lon) / 2.0, (p1.lat + p2.lat) / 2.0);

    /// <summary>
    /// Approximate an angle in the counter-clockwise direction.
    /// </summary>
    /// <returns>Angle in radians.</returns>
    internal static double RotAngle(WgsPoint p1, WgsPoint p2)
    {
        var lat = DegToRad(Midpoint(p1, p2).lat);

        // offsets on (x, y)-axis given in radians

        var x = DegToRad(p2.lon - p1.lon) * LonRadCost(lat);
        var y = DegToRad(p2.lat - p1.lat) * LatRadCost(lat);

        return Math.Atan2(y, x);
    }

    /// <summary>
    /// Calculate the central angle between two given points on a sphere in
    /// radians and multiply by the Earth radius.<br/>
    /// 
    /// hav(x) = sin^2 (x^2 / 2.0), arcsin(x) = arctan(x / sqrt(1.0 - x^2)).
    /// <list>
    /// <item>https://www.movable-type.co.uk/scripts/latlong.html</item>
    /// <item>https://en.wikipedia.org/wiki/Haversine_formula#Formulation</item>
    /// </list>
    /// </summary>
    /// <returns>The distance in meters.</returns>
    public static double HaversineDistance(WgsPoint p1, WgsPoint p2)
    {
        var deltaLam = DegToRad(p2.lon - p1.lon);
        var deltaPhi = DegToRad(p2.lat - p1.lat);

        var hav = Math.Pow((Math.Sin(deltaPhi / 2.0)), 2.0) + Math.Cos(DegToRad(p1.lat)) * Math.Cos(DegToRad(p2.lat)) * Math.Pow((Math.Sin(deltaLam / 2.0)), 2.0);

        var ang = 2.0 * Math.Atan2(Math.Sqrt(hav), Math.Sqrt(1.0 - hav));

        return _earthRadius * ang;
    }

    /// <summary>
    /// Construct a bounding ellipse given foci and a maximum distance. Foci are
    /// guaranteed to be within the ellipse even if the distance is not enough.
    /// </summary>
    /// <param name="f1">Focus 1</param>
    /// <param name="f2">Focus 2</param>
    /// <param name="distance">Maximum walking distance (in meters).</param>
    public static List<WgsPoint> BoundingEllipse(WgsPoint f1, WgsPoint f2, double distance)
    {
        var m = Spherical.Midpoint(f1, f2);
        var c = Spherical.HaversineDistance(f1, f2) / 2.0;

        /* Construct a bounding ellipse with the center at the origin (0, 0).
         * Note that coordinates of the result are in meters! */

        var a = ((distance > (2.0 * c)) ? distance : (2.0 * c + 200.0)) / 2.0;
        var b = Math.Sqrt(a * a - c * c);

        var factory = new GeometricShapeFactory();
        factory.Envelope = new(-a, +a, -b, +b);
        var e1 = factory.CreateEllipse();

        // rotate ellipse

        var e2 = new AffineTransformation()
            .Rotate(Spherical.RotAngle(f1, f2))
            .Transform(e1);

        /* Transform the ellipse with respect to the parallel at the latitude
         * of the midpoint. Note that coordinates of the result are in degs! */

        var lr = DegToRad(m.lat);
        var cs = new Coordinate[e2.Coordinates.Length];

        for (var i = 0; i < cs.Length; ++i)
        {
            var pt = e2.Coordinates[i];
            cs[i] = new Coordinate(
                Spherical.RadToDeg(pt.X / Spherical.LonRadLeng(lr)),
                Spherical.RadToDeg(pt.Y / Spherical.LatRadLeng(lr)));
        }

        // translate ellipse

        var e3 = new AffineTransformation()
            .Translate(m.lon, m.lat)
            .Transform(new Polygon(new LinearRing(cs)));

        return e3.Coordinates.Select(c => new WgsPoint(c.X, c.Y)).ToList();
    }
}
