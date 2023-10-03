using System;
using Microsoft.Extensions.Logging;

namespace SmartWalk.Api.Test.Fakes;

internal class FakeLogger<T> : ILogger<T>
{
    private class Scope : IDisposable
    {
        public void Dispose() { }
    }

    public IDisposable BeginScope<TState>(TState state) => new Scope();

    public bool IsEnabled(LogLevel logLevel) => true;

    public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception exception, Func<TState, Exception, string> formatter) { }
}
