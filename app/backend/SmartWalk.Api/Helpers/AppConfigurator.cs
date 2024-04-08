using System;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Authentication.Certificate;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using Serilog;
using SmartWalk.Application.Entities;
using SmartWalk.Application.Handlers;
using SmartWalk.Application.Interfaces;
using SmartWalk.Core.Interfaces;
using SmartWalk.Infrastructure.Advicer;
using SmartWalk.Infrastructure.EntityIndex;
using SmartWalk.Infrastructure.EntityStore;
using SmartWalk.Infrastructure.RoutingEngine;

namespace SmartWalk.Api;

public static class AppConfigurator
{
    private static readonly string _corsPolicy = "SmartWalkCors";

    public static void CreateLogger()
    {
        Log.Logger ??= new LoggerConfiguration().WriteTo.Console().CreateLogger();
    }

    public static WebApplicationBuilder Configure(WebApplicationBuilder builder)
    {
        var phase = "Application Builder";
        Log.Information(phase);

        Log.Information("{Phase}: CORS Policy Definition", phase);
        builder.Services.AddCors(cors => cors.AddPolicy(_corsPolicy, builder =>
        {
            builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
        }));

        Log.Information("{Phase}: Authentication Methods", phase);
        builder.Services
            .AddAuthentication(CertificateAuthenticationDefaults.AuthenticationScheme)
            .AddCertificate();

        Log.Information("{Phase}: Controllers", phase);
        builder.Services.AddControllers();

        Log.Information("{Phase}: Endpoints API Explorer", phase);
        builder.Services.AddEndpointsApiExplorer();

        Log.Information("{Phase}: Health Checks", phase);
        builder.Services.AddHealthChecks();

        Log.Information("{Phase}: Generate Swagger UI", phase);
        builder.Services.AddSwaggerGen((g) =>
        {
            g.SwaggerDoc("v1", new OpenApiInfo
            {
                Title = "SmartWalk.Api",
                Version = "1.0.0",
                Description = "Web application for keyword-aware walking route search"
            });

            Directory
                .GetFiles(AppContext.BaseDirectory, "*.xml", SearchOption.TopDirectoryOnly).ToList()
                .ForEach(f => g.IncludeXmlComments(f));
        });

        Log.Information("{Phase}: Keyword Advicer Singleton", phase);
        builder.Services.AddSingleton<IKeywordAdvicer>(MongoKeywordAdvicer.GetInstance());

        Log.Information("{Phase}: AdviseKeywordsHandler Singleton", phase);
        builder.Services.AddSingleton<AdviseKeywordsHandler>();

        Log.Information("{Phase}: Entity Store Singleton", phase);
        builder.Services.AddSingleton<IEntityStore>(MongoEntityStore.GetInstance());

        Log.Information("{Phase}: GetPlaceHandler Singleton", phase);
        builder.Services.AddSingleton<GetPlaceHandler>();

        Log.Information("{Phase}: Search Context", phase);
        builder.Services.AddSingleton<ISearchContext>(new SearchContext()
        {
            EntityIndex = MongoEntityIndex.GetInstance(),
            RoutingEngine = OsrmRoutingEngine.GetInstance()
        });

        return builder;
    }

    public static WebApplication Configure(WebApplication app)
    {
        var phase = "Application Instance";
        Log.Information(phase);

        Log.Information("{Phase}: Swagger User Interface", phase);
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger().UseSwaggerUI(u =>
            {
                u.SwaggerEndpoint("v1/swagger.yaml", "SmartWalk.Api");
            });
        }

        Log.Information("{Phase}: Use CORS Policy", phase);
        app.UseCors(_corsPolicy);

        Log.Information("{Phase}: Use Authorization", phase);
        app.UseAuthorization();

        Log.Information("{Phase}: Use Authentization", phase);
        app.UseAuthentication();

        Log.Information("{Phase}: Map Controllers", phase);
        app.MapControllers();

        Log.Information("{Phase}: Map Health Checks", phase);
        app.MapHealthChecks("/healthcheck");

        return app;
    }
}
