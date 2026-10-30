using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using ModelContextProtocol.Server;
using SmartWalk.Application.Interfaces;
using SmartWalk.Core.Entities;

namespace SmartWalk.Api.Mcp;

/// <summary>
/// MCP tool exposing keyword advice (autocomplete) functionality.
/// </summary>
[McpServerToolType]
public sealed partial class AdviceKeywordsMcpTool
{
    private readonly ILogger<AdviceKeywordsMcpTool> logger;

    private readonly IGetAdviceKeywordsQueryHandler handler;

    public AdviceKeywordsMcpTool(ILogger<AdviceKeywordsMcpTool> logger, IGetAdviceKeywordsQueryHandler handler)
    {
        this.logger = logger;
        this.handler = handler;
    }

    /// <summary>
    /// Returns autocomplete keyword suggestions that start with the supplied prefix.
    /// </summary>
    /// <param name="prefix">Prefix that all returned keywords must share.</param>
    /// <param name="count">Upper bound on the number of returned suggestions.</param>
    /// <returns>List of keyword advice items.</returns>
    [McpServerTool]
    [Description("Returns autocomplete keyword suggestions that start with the supplied prefix.")]
    public partial async Task<List<KeywordAdviceItem>> GetAdviceKeywords(
        [Description("Prefix that all returned keywords must share.")] string prefix,
        [Description("Upper bound on the number of returned suggestions.")] int count
    ) {
        try
        {
            // throw new Exception("Uff");
            return await handler.Handle(new() { prefix = prefix, count = count });
        }
        catch (Exception ex)
        {
            logger.LogError("{Error}", ex.Message);
            throw;
        }
    }
}
