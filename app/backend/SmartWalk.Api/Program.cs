using System;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Authentication.Certificate;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using SmartWalk.Api.Contexts;
using SmartWalk.Infrastructure.Advicer;
using SmartWalk.Infrastructure.EntityIndex;
using SmartWalk.Infrastructure.EntityStore;
using SmartWalk.Infrastructure.RoutingEngine;

namespace SmartWalk.Api;

public class Program
{
    private static readonly string _policy = "SmartWalkCors";

    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Services.AddCors(cors => cors.AddPolicy(_policy, builder =>
        {
            builder.WithOrigins("*").AllowAnyMethod().AllowAnyHeader();
        }));

        builder.Services.AddAuthentication(CertificateAuthenticationDefaults.AuthenticationScheme).AddCertificate();

        builder.Services.AddControllers();
        builder.Services.AddEndpointsApiExplorer();

        builder.Services.AddSwaggerGen((g) => {
            g.SwaggerDoc("v1", new OpenApiInfo()
            {
                Title = "SmartWalk.Api",
                Version = "1.0.0",
                Description = "Web application for keyword-aware walking route search"
            });

            Directory
                .GetFiles(AppContext.BaseDirectory, "*.xml", SearchOption.TopDirectoryOnly).ToList()
                .ForEach(f => g.IncludeXmlComments(f));
        });

        builder.Services.AddSingleton<IAdviceContext, AdviceContext>((_) =>
        {
            return new()
            {
                KeywordsAdvicer = AdvicerFactory.GetKeywordsAdvicer()
            };
        });

        builder.Services.AddSingleton<IEntityContext, EntityContext>((_) =>
        {
            return new()
            {
                Store = EntityStoreFactory.GetInstance()
            };
        });

        builder.Services.AddSingleton<ISearchContext, SearchContext>((_) =>
        {
            return new()
            {
                EntityIndex = EntityIndexFactory.GetInstance(),
                RoutingEngine = RoutingEngineFactory.GetInstance()
            };
        });

        var wapp = builder.Build();

        if (wapp.Environment.IsDevelopment())
        {
            wapp.UseSwagger()
                .UseSwaggerUI(u => {
                    u.SwaggerEndpoint("v1/swagger.yaml", "SmartWalk.Api");
                });
        }

        wapp.UseCors(_policy)
//          .UseHttpsRedirection()
            .UseAuthorization()
            .UseAuthentication();

        wapp.MapControllers();

        wapp.Run();
    }
}
