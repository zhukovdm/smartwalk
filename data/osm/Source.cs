using System.Collections;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.Logging;
using OsmSharp;
using OsmSharp.Streams;

namespace osm;

internal class Source : IEnumerable<Place>
{
    double w, n, e, s;
    private readonly ILogger _logger;
    private readonly OsmStreamSource _stream;

    public Source(ILogger logger, OsmStreamSource stream, (double, double, double, double) bbox)
    {
        _logger = logger; _stream = stream; (w, n, e, s) = bbox;
    }

    public IEnumerator<Place> GetEnumerator()
    {
        var source = from item in _stream.FilterBox((float)w, (float)n, (float)e, (float)s) where (item.Type != OsmGeoType.Relation) select item;

        long step = 0;

        foreach (var item in source)
        {
            ++step;

            if (step % 10_000_000 == 0)
            {
                _logger.LogInformation("Still working... {0} objects already processed.", step);
            }

            var place = Inspector.Inspect(item as Node) ?? Inspector.Inspect(item as Way);

            if (place is not null) { yield return place; }
        }
    }

    IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();
}
