using System;
using System.Collections.Generic;
using System.Linq;
using CommandLine;
using Microsoft.Extensions.Logging;

namespace osm;

internal class Program
{
    private sealed class Options
    {
        [Option("file", Required = true)]
        public string File { get; set; }

        [Option("bbox", Required = false)]
        public IEnumerable<string> Bbox { get; set; }
    }

    private static void Main(string[] args)
    {
        var log = LoggerFactory
            .Create(b => b.AddConsole().SetMinimumLevel(LogLevel.Information))
            .CreateLogger<Program>();

        var opt = new Parser().ParseArguments<Options>(args).Value;

        log.LogInformation("File {0} is being processed...", opt.File);

        try
        {
            var source = SourceFactory.GetInstance(log, opt.File, opt.Bbox.ToList());
            var target = TargetFactory.GetInstance(log);

            foreach (var grain in source)
            {
                target.Consume(grain);
            }
            target.Complete();
        }
        catch (Exception ex) { log.LogError(ex.Message); }
    }
}
