using System;
using Microsoft.AspNetCore.Builder;
using Serilog;

namespace SmartWalk.Api;

public sealed class Program
{
    public static int Main(string[] args)
    {
        var appName = "SmartWalk";
        AppConfigurator.CreateLogger();

        try
        {
            Log.Information("Configuring application ({AppName})", appName);

            var builder = AppConfigurator.Configure(WebApplication.CreateBuilder(args));
            var app = AppConfigurator.Configure(builder.Build());

            Log.Information("Starting application ({AppName})", appName);

            app.Run();

            Log.Information("Stopping application ({AppName})", appName);
            return 0;
        }
        catch (Exception ex)
        {
            Log.Fatal("Application crashed with the message: {Message}", ex.Message);
            return 1;
        }
        finally
        {
            Log.CloseAndFlush();
        }
    }
}
