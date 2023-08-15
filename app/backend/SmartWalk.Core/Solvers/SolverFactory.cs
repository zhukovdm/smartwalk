using SmartWalk.Domain.Interfaces;

namespace SmartWalk.Core.Solvers;

public static class SolverFactory
{
    public static ISolver GetInstance() => new IfSolver();
}
