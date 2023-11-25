using System;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Authentication.Certificate;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using SmartWalk.Application.Entities;
using SmartWalk.Application.Interfaces;
using SmartWalk.Infrastructure.Advicer;
using SmartWalk.Infrastructure.EntityIndex;
using SmartWalk.Infrastructure.EntityStore;
using SmartWalk.Infrastructure.RoutingEngine;

namespace SmartWalk.Api;

public class Program
{
    public static void Main(string[] args)
    {
        var policy = "SmartWalkCors";

        var builder = WebApplication.CreateBuilder(args);

        builder.Services.AddCors(cors => cors.AddPolicy(policy, builder =>
        {
            builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
        }));

        builder.Services.AddAuthentication(CertificateAuthenticationDefaults.AuthenticationScheme).AddCertificate();

        builder.Services.AddControllers();
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddHealthChecks();

        builder.Services.AddSwaggerGen((g) => {
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

        builder.Services.AddSingleton<IAdviceContext>(new AdviceContext()
        {
            KeywordAdvicer = MongoKeywordAdvicer.GetInstance()
        });

        builder.Services.AddSingleton<IEntityContext>(new EntityContext()
        {
            EntityStore = MongoEntityStore.GetInstance()
        });

        builder.Services.AddSingleton<ISearchContext>(new SearchContext()
        {
            EntityIndex = MongoEntityIndex.GetInstance(),
            RoutingEngine = OsrmRoutingEngine.GetInstance()
        });

        var wapp = builder.Build();

        if (wapp.Environment.IsDevelopment())
        {
            wapp.UseSwagger().UseSwaggerUI(u =>
            {
                u.SwaggerEndpoint("v1/swagger.yaml", "SmartWalk.Api");
            });
        }

        wapp.UseCors(policy)
//          .UseHttpsRedirection()
            .UseAuthorization()
            .UseAuthentication();

        wapp.MapControllers();
        wapp.MapHealthChecks("/healthcheck");

        wapp.Run();
    }
}
