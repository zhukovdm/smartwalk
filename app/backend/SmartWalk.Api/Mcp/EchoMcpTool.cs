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
    public partial string Ping(string message)
    {
        return message;
    }
}
