using System;
using System.ComponentModel;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using ModelContextProtocol;
using ModelContextProtocol.Protocol;
using ModelContextProtocol.Server;
using SmartWalk.Application.Interfaces;
using SmartWalk.Core.Entities;

namespace SmartWalk.Api.Mcp;

/// <summary>
/// MCP tool exposing entity place lookup functionality.
/// </summary>
[McpServerToolType]
public sealed partial class EntityPlacesMcpTool
{
    private readonly ILogger<EntityPlacesMcpTool> logger;

    private readonly IGetEntityPlaceQueryHandler handler;

    public EntityPlacesMcpTool(ILogger<EntityPlacesMcpTool> logger, IGetEntityPlaceQueryHandler handler)
    {
        this.logger = logger;
        this.handler = handler;
    }

    /// <summary>
    /// Returns the unique place that has the supplied identifier.
    /// </summary>
    /// <param name="smartId">Unique identifier of the place to retrieve.</param>
    /// <returns>Place object.</returns>
    [McpServerTool(UseStructuredContent = true, OutputSchemaType = typeof(ExtendedPlace))]
    [Description("Returns the unique place that has the supplied identifier.")]
    public partial async Task<CallToolResult> GetEntityPlace(
        [Description("Unique identifier of the place to retrieve.")] string smartId
    )
    {
        try
        {
            var place = (await handler.Handle(new() { smartId = smartId }))
                ?? throw new McpException($"Place with smartId {smartId} was not found.");

            return new CallToolResult()
            {
                Content = [new TextContentBlock { Text = place.AsMcpStructuredContent() }],
                StructuredContent = JsonSerializer.SerializeToElement(place)
            };
        }
        catch (McpException)
        {
            throw;
        }
        catch (Exception ex)
        {
            logger.LogError("{Error}", ex.Message);
            return ResponderBase<CallToolResult>.FailureMcp(ex);
        }
    }
}
