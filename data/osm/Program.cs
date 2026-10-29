using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CommandLine;
using Microsoft.Extensions.Logging;

namespace osm;

internal class Program
{
    private sealed class Options
    {
        [Option("file", Required = true)]
        public required string File { get; set; }

        [Option("conn", Required = true)]
        public required string Conn { get; set; }

        [Option("bbox", Required = true)]
        public required IEnumerable<string> Bbox { get; set; }

        [Option("ncnt", Required = true)]
        public required int Ncnt { get; set; }

        [Option("wcnt", Required = true)]
        public required int Wcnt { get; set; }

        [Option("rows", Required = true)]
        public required int Rows { get; set; }

        [Option("cols", Required = true)]
        public required int Cols { get; set; }
    }

    private static async Task Main(string[] args)
    {
        var log = LoggerFactory
            .Create(b => b.AddConsole().SetMinimumLevel(LogLevel.Information))
            .CreateLogger<Program>();

        var opt = new Parser().ParseArguments<Options>(args).Value;

        if (log.IsEnabled(LogLevel.Information))
        {
            log.LogInformation("File {File} is being processed.", opt.File);
        }

        try
        {
            // var locator = await OverpassElementLocatorFactory
            //     .GetInstance(log, [..opt.Bbox], opt.Rows, opt.Cols);

            var locator = new ElementLocator1(log, opt.Ncnt, opt.Wcnt);

            // Phase 1, cache objects to save memory

            using (var source = SourceFactory.GetInstance(log, opt.File, [.. opt.Bbox]))
            {
                if (log.IsEnabled(LogLevel.Information))
                {
                    log.LogInformation("Phase 1. Locating points and bounding boxes.");
                }

                foreach (var item in source) { locator.TryAdd(item); }

                if (log.IsEnabled(LogLevel.Information))
                {
                    log.LogInformation("Located {PointCount} valid points and {BboxCount} bounding boxes.", locator.PointCount, locator.BboxCount);
                }
            }

            // Phase 2, extract information and write to the database

            using (var source = SourceFactory.GetInstance(log, opt.File, [.. opt.Bbox]))
            {
                var transformer = new Transformer(locator);

                var target = TargetFactory.GetInstance(log, opt.Conn);

                foreach (var item in source)
                {
                    var place = transformer.Transform(item);
                    if (place is not null)
                    {
                        target.Load(place);
                    }
                }
                target.Complete();
            }
        }
        catch (Exception ex) { log.LogError(ex, "{Message}", ex.Message); }
    }
}
