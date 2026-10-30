using System.ComponentModel;
using ModelContextProtocol.Server;

namespace SmartWalk.Api.Mcp;

/// <summary>
/// MCP tool used for test purposes to spike the ASP.NET Core MCP integration.
/// </summary>
[McpServerToolType]
public sealed partial class EchoMcpTool
{
    /// <summary>
    /// Returns the supplied message back to the caller.
    /// </summary>
    /// <param name="message">Text to echo back.</param>
    /// <returns>Echoed text.</returns>
    [McpServerTool]
    [Description("Returns the supplied message back to the caller.")]
    public partial string Ping([Description("Text to echo back.")] string message)
    {
        return message;
    }
}
