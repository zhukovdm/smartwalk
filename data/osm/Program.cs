﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CommandLine;
using Microsoft.Extensions.Logging;

namespace osm;

internal class Program
{
    private sealed class Options
    {
        [Option("file", Required = true)]
        public string File { get; set; }

        [Option("conn", Required = true)]
        public string Conn { get; set; }

        [Option("bbox", Required = true)]
        public IEnumerable<string> Bbox { get; set; }

        [Option("rows", Required = true)]
        public int Rows { get; set; }

        [Option("cols", Required = true)]
        public int Cols { get; set; }
    }

    private static async Task Main(string[] args)
    {
        var log = LoggerFactory
            .Create(b => b.AddConsole().SetMinimumLevel(LogLevel.Information))
            .CreateLogger<Program>();

        var opt = new Parser().ParseArguments<Options>(args).Value;

        log.LogInformation("File {0} is being processed...", opt.File);

        try
        {
            var locator = await OverpassElementLocatorFactory
                .GetInstance(log, opt.Bbox.ToList(), opt.Rows, opt.Cols);

            var transformer = new Transformer(locator);

            var source = SourceFactory
                .GetInstance(log, opt.File, opt.Bbox.ToList());

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
        catch (Exception ex) { log.LogError(ex.Message); }
    }
}
