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
    private readonly ElementLocator _locator;

    public Source(ILogger logger, OsmStreamSource stream, (double, double, double, double) bbox, ElementLocator locator)
    {
        _logger = logger; _stream = stream; (_w, _n, _e, _s) = bbox; _locator = locator;
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

            var place = Inspector.Inspect(item as Node) ?? Inspector.Inspect(item as Way) ?? Inspector.Inspect(item as Relation, _locator);

            if (place is not null) { yield return place; }
        }
    }

    IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();
}

internal static class SourceFactory
{
    private static OsmStreamSource ToStream(string fileName)
    {
        FileStream fStream;
        var path = PathBuilder.GetOsmFilePath(fileName);

        try
        {
            fStream = File.OpenRead(path);
        }
        catch (Exception) { throw new Exception($"Cannot create file stream at ${fileName}."); }

        Func<OsmStreamSource> func = null;

        if (fileName.EndsWith(".pbf"))
        {
            func = new(() => { return new PBFOsmStreamSource(fStream); });
        }

        if (fileName.EndsWith(".osm"))
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

    public static Source GetInstance(ILogger logger, string file, List<string> bbox, ElementLocator locator)
    {
        return new(logger, ToStream(file), Converter.ToBbox(bbox), locator);
    }
}
