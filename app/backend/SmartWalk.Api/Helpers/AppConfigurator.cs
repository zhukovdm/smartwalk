using System;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Authentication.Certificate;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using Polly;
using Serilog;
using SmartWalk.Application.Handlers;
using SmartWalk.Application.Interfaces;
using SmartWalk.Infrastructure.Mongo;
using SmartWalk.Infrastructure.Osrm;

namespace SmartWalk.Api.Helpers;

public static class AppConfigurator
{
    private static readonly string corsPolicy = "SmartWalkCors";

    public static void CreateLogger()
    {
        Log.Logger ??= new LoggerConfiguration().WriteTo.Console().CreateLogger();
    }

    public static WebApplicationBuilder Configure(WebApplicationBuilder builder)
    {
        var phase = "Application Builder";
        Log.Information(phase);

        Log.Information("{Phase}: CORS Policy Definition", phase);
        builder.Services.AddCors(cors => cors.AddPolicy(corsPolicy, builder =>
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

        Log.Information("{Phase}: Http Client Factory", phase);
        builder.Services.AddHttpClient();

        Log.Information("{Phase}: Health Checks", phase);
        builder.Services.AddHealthChecks();

        Log.Information("{Phase}: Generate Swagger UI", phase);
        builder.Services.AddSwaggerGen((g) =>
        {
            g.SwaggerDoc("v1", new OpenApiInfo
            {
                Title = "SmartWalk.Api",
                Version = "1.0.0",
                Description = "Web application for keyword-aware route search"
            });

            Directory
                .GetFiles(AppContext.BaseDirectory, "*.xml", SearchOption.TopDirectoryOnly).ToList()
                .ForEach(f => g.IncludeXmlComments(f));
        });

        Log.Information("{Phase}: IKeywordAdvicer Singleton", phase);
        builder.Services.AddSingleton(MongoKeywordAdvicer.GetInstance());

        Log.Information("{Phase}: IEntityStore Singleton", phase);
        builder.Services.AddSingleton(MongoEntityStore.GetInstance());

        Log.Information("{Phase}: IEntityIndex Singleton", phase);
        builder.Services.AddSingleton(MongoEntityIndex.GetInstance());

        Log.Information("{Phase}: IShortestPathFinder Transient", phase);
        builder.Services.AddTransient<IShortestPathFinder, OsrmShortestPathFinder>();

        // Log.Information("{Phase}: IDistanceFuncFinder Transient", phase);
        // builder.Services.AddTransient<IDistanceFuncFinder, OsrmDistanceFuncFinder>();

        Log.Information("{Phase}: IGetAdviceKeywordsQueryHandler Transient", phase);
        builder.Services.AddTransient<IGetAdviceKeywordsQueryHandler, GetAdviceKeywordsQueryHandler>();

        Log.Information("{Phase}: IGetEntityPlaceQueryHandler Transient", phase);
        builder.Services.AddTransient<IGetEntityPlaceQueryHandler, GetEntityPlaceQueryHandler>();

        Log.Information("{Phase}: ISearchDirecsQueryHandler Transient", phase);
        builder.Services.AddTransient<ISearchDirecsQueryHandler, SearchDirecsQueryHandler>();

        Log.Information("{Phase}: ISearchPlacesQueryHandler Transient", phase);
        builder.Services.AddTransient<ISearchPlacesQueryHandler, SearchPlacesQueryHandler>();

        Log.Information("{Phase}: ISearchRoutesQueryHandler Transient", phase);
        builder.Services.AddTransient<ISearchRoutesQueryHandler, SearchRoutesQueryHandler>();

        Log.Information("{Phase}: Default Resilience Pipeline", phase);
        builder.Services.AddResiliencePipeline("DefaultResiliencePipeline", b => b
            .AddRetry(new Polly.Retry.RetryStrategyOptions
            {
                BackoffType = DelayBackoffType.Exponential,
                UseJitter = true,
                Delay = TimeSpan.FromSeconds(1),
                MaxRetryAttempts = 2
            }));

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
        app.UseCors(corsPolicy);

        Log.Information("{Phase}: Use Authentication", phase);
        app.UseAuthentication();

        Log.Information("{Phase}: Use Authorization", phase);
        app.UseAuthorization();

        Log.Information("{Phase}: Map Controllers", phase);
        app.MapControllers();

        Log.Information("{Phase}: Map Health Checks", phase);
        app.MapHealthChecks("/healthcheck");

        return app;
    }
}
