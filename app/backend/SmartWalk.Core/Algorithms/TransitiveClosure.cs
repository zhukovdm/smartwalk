using System.Collections.Generic;

namespace SmartWalk.Core.Algorithms;

public static class TransitiveClosure
{
    /// <summary>
    /// Calculate transitive closure on a given boolean matrix.
    /// <list>
    /// <item>https://en.wikipedia.org/wiki/Transitive_closure#In_graph_theory</item>
    /// </list>
    /// </summary>
    public static List<List<bool>> Closure(List<List<bool>> precMatrix)
    {
        var order = precMatrix.Count;

        for (int k = 0; k < order; ++k)
        {
            for (int i = 0; i < order; ++i)
            {
                for (int j = 0; j < order; ++j)
                {
                    precMatrix[i][j] = precMatrix[i][j] || (precMatrix[i][k] && precMatrix[k][j]);
                }
            }
        }
        return precMatrix;
    }
}
