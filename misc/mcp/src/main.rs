use rmcp::{
    ClientLifecycleMode, ClientServiceExt,
    model::{CallToolRequestParams, ClientConfig, ProtocolVersion},
    transport::{
        StreamableHttpClientTransport, streamable_http_client::StreamableHttpClientTransportConfig,
    },
};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let url = std::env::var("MCP_URL").unwrap_or_else(|_| "http://localhost:5017/mcp".to_string());

    let transport = StreamableHttpClientTransport::from_config(
        StreamableHttpClientTransportConfig::with_uri(url),
    );

    let client = ClientConfig::default()
        .serve_with_lifecycle(
            transport,
            ClientLifecycleMode::Auto {
                preferred_versions: vec![ProtocolVersion::V_2026_07_28],
                legacy_version: Some(ProtocolVersion::V_2025_11_25),
            },
        )
        .await?;

    let tools = client.list_tools(None).await?;

    println!("Tools:");
    for tool in &tools.tools {
        println!(
            "- {}: {}",
            tool.name,
            tool.description.as_deref().unwrap_or("")
        );
    }

    let tool_name = tools
        .tools
        .iter()
        .map(|tool| tool.name.as_ref())
        .find(|name| name.eq_ignore_ascii_case("ping"))
        .or_else(|| tools.tools.first().map(|tool| tool.name.as_ref()))
        .unwrap_or("ping");

    let message = "hello".to_string();

    println!("Calling tool '{tool_name}'...");
    println!("ping: {}", message);

    let mut args = serde_json::Map::new();
    args.insert("message".to_string(), serde_json::Value::String(message));

    let result = client
        .call_tool(CallToolRequestParams::new(tool_name.to_string()).with_arguments(args))
        .await?;

    println!("is_error: {:?}", result.is_error);

    for content in &result.content {
        if let Some(text) = content.as_text() {
            println!("content: {}", text.text);
        } else {
            println!("content: {content:?}");
        }
    }

    if let Some(structured) = &result.structured_content {
        println!("structured: {structured}");
    }

    let advice_tool_name = tools
        .tools
        .iter()
        .map(|tool| tool.name.as_ref())
        .find(|name| name.eq_ignore_ascii_case("get_advice_keywords"))
        .map(|name| name.to_string())
        .unwrap_or_else(|| "get_advice_keywords".to_string());

    let prefix = "a".to_string();
    let count = 3;

    println!("Calling tool '{advice_tool_name}'...");
    println!("prefix: {prefix}");
    println!("count: {count}");

    let mut advice_args = serde_json::Map::new();
    advice_args.insert("prefix".to_string(), serde_json::Value::String(prefix));
    advice_args.insert("count".to_string(), serde_json::Value::from(count));

    let advice_result = client
        .call_tool(CallToolRequestParams::new(advice_tool_name).with_arguments(advice_args))
        .await?;

    println!("is_error: {:?}", advice_result.is_error);

    for content in &advice_result.content {
        if let Some(text) = content.as_text() {
            println!("content: {}", text.text);
        } else {
            println!("content: {content:?}");
        }
    }

    if let Some(structured) = &advice_result.structured_content {
        println!("structured: {structured}");
    }

    client.cancel().await?;

    Ok(())
}
