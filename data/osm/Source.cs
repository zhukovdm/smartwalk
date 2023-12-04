using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Microsoft.Extensions.Logging;
using OsmSharp;
using OsmSharp.Streams;

namespace osm;

internal class Source : IEnumerable<OsmGeo>
{
    private readonly ILogger logger;
    private readonly OsmStreamSource stream;
    private readonly double w, n, e, s;

    public Source(ILogger logger, OsmStreamSource stream, (double, double, double, double) bbox)
    {
        this.logger = logger; this.stream = stream; (w, n, e, s) = bbox;
    }

    public IEnumerator<OsmGeo> GetEnumerator()
    {
        var source = from element in stream.FilterBox((float)w, (float)n, (float)e, (float)s) select element;

        long step = 0;

        foreach (var element in source)
        {
            ++step;

            if (step % 10_000_000 == 0)
            {
                logger.LogInformation("Still working... {0} objects already processed.", step);
            }

            yield return element;
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
            throw new Exception($"Name of the file should have .osm or .pbf extension.");
        }

        try
        {
            return func.Invoke();
        }
        catch (Exception) { throw new Exception($"Cannot create OSM stream from ${fStream}."); }
    }

    public static Source GetInstance(ILogger logger, string file, List<string> bbox)
    {
        return new(logger, ToStream(file), Converter.ToBbox(bbox));
    }
}
