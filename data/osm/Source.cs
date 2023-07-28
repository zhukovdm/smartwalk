using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Microsoft.Extensions.Logging;
using OsmSharp;
using OsmSharp.Streams;

namespace osm;

internal class Source : IEnumerable<Place>
{
    private readonly double _w, _n, _e, _s;
    private readonly ILogger _logger;
    private readonly OsmStreamSource _stream;
    private readonly Sophox _sophox;

    public Source(ILogger logger, OsmStreamSource stream, (double, double, double, double) bbox, Sophox sophox)
    {
        _logger = logger; _stream = stream; (_w, _n, _e, _s) = bbox; _sophox = sophox;
    }

    public IEnumerator<Place> GetEnumerator()
    {
        var source = from item in _stream.FilterBox((float)_w, (float)_n, (float)_e, (float)_s) select item;

        long step = 0;

        foreach (var item in source)
        {
            ++step;

            if (step % 10_000_000 == 0)
            {
                _logger.LogInformation("Still working... {0} objects already processed.", step);
            }

            var place = Inspector.Inspect(item as Node) ?? Inspector.Inspect(item as Way) ?? Inspector.Inspect(item as Relation, _sophox);

            if (place is not null) { yield return place; }
        }
    }

    IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();
}

internal static class SourceFactory
{
    private static OsmStreamSource ToStream(string file)
    {
        FileStream fStream;
        var path = string.Join(Path.DirectorySeparatorChar, new[] { Constants.ASSETS_BASE_ADDR, "osm-maps", file });

        try
        {
            fStream = File.OpenRead(path);
        }
        catch (Exception) { throw new Exception($"Cannot create file stream at ${file}."); }

        Func<OsmStreamSource> func = null;

        if (file.EndsWith(".pbf"))
        {
            func = new(() => { return new PBFOsmStreamSource(fStream); });
        }

        if (file.EndsWith(".osm"))
        {
            func = new(() => { return new XmlOsmStreamSource(fStream); });
        }

        if (func is null)
        {
            throw new Exception($"Name of the file should have .pbf or .osm extension.");
        }

        try
        {
            return func.Invoke();
        }
        catch (Exception) { throw new Exception($"Cannot create OSM stream from ${fStream}."); }
    }

    public static Source GetInstance(ILogger logger, string file, List<string> bbox, Sophox sophox)
    {
        return new(logger, ToStream(file), Converter.ToBbox(bbox), sophox);
    }
}
