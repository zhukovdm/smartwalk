using SmartWalk.Domain.Interfaces;

namespace SmartWalk.Services.RoutingEngine;

public static class RoutingEngineFactory
{
    public static IRoutingEngine GetInstance()
        => OsrmRoutingEngine.GetInstance();
}
