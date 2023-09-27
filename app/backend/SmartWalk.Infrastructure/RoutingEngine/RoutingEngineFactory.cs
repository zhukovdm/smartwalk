using SmartWalk.Model.Interfaces;

namespace SmartWalk.Infrastructure.RoutingEngine;

public static class RoutingEngineFactory
{
    public static IRoutingEngine GetInstance() => OsrmRoutingEngine.GetInstance();
}
