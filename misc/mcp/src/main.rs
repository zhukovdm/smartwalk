use rmcp::{
    ClientLifecycleMode, ClientServiceExt,
    model::{CallToolRequestParams, CallToolResult, ClientConfig, ProtocolVersion},
    transport::{
        StreamableHttpClientTransport, streamable_http_client::StreamableHttpClientTransportConfig,
    },
};

fn print_result(result: &CallToolResult) -> () {
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
}

#[tokio::main(flavor = "current_thread")]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let default_url = "http://localhost:5017/mcp".to_string();
    let url = std::env::var("MCP_URL").unwrap_or_else(|_| default_url);

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

    let tool_list = client.list_tools(None).await?;

    println!("Available tools:");
    for tool in &tool_list.tools {
        println!(
            "- {}: {}",
            tool.name,
            tool.description.as_deref().unwrap_or("")
        );
    }
    println!();

    // ping

    let tool_name = "ping".to_string();
    let message = "hello".to_string();

    println!("Calling tool '{tool_name}'...");
    println!("ping: {message}");

    let mut args = serde_json::Map::new();
    args.insert("message".to_string(), serde_json::Value::String(message));

    let result = client
        .call_tool(CallToolRequestParams::new(tool_name).with_arguments(args))
        .await?;

    print_result(&result);
    println!();

    // get_advice_keywords

    let tool_name = "get_advice_keywords";
    let (prefix, count) = ("a".to_string(), 3);

    println!("Calling tool '{tool_name}'...");
    println!("prefix: {prefix}, count: {count}");

    let mut args = serde_json::Map::new();
    args.insert("prefix".to_string(), serde_json::Value::String(prefix));
    args.insert("count".to_string(), serde_json::Value::from(count));

    let result = client
        .call_tool(CallToolRequestParams::new(tool_name).with_arguments(args))
        .await?;

    print_result(&result);
    println!();

    // get_entity_place

    let tool_name = "get_entity_place";
    let smart_id = "6ae34bd6ef8fdc7be1718d36".to_string();

    println!("Calling tool '{tool_name}'...");
    println!("smartId: {smart_id}");

    let mut args = serde_json::Map::new();
    args.insert("smartId".to_string(), serde_json::Value::String(smart_id));

    let result = client
        .call_tool(CallToolRequestParams::new(tool_name).with_arguments(args))
        .await?;

    print_result(&result);

    // shutdown the client

    client.cancel().await?;
    Ok(())
}
