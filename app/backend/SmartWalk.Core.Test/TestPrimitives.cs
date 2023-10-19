using System;
using System.Collections.Generic;
using System.Linq;
using SmartWalk.Core.Algorithms;
using SmartWalk.Core.Entities;
using SmartWalk.Core.Interfaces;

namespace SmartWalk.Core.Test;

public static class TestPrimitives
{
    public static List<List<double>> GenerateUnitDistanceMatrix(int order)
    {
        var result = new List<List<double>>();

        for (int row = 0; row < order; ++row)
        {
            result.Add(new());

            for (int col = 0; col < order; ++col)
            {
                result[row].Add(row == col ? 0 : 1);
            }
        }
        return result;
    }

    public static IDistanceMatrix GenerateRandomDistanceMatrix(int order)
    {
        var rand = new Random();

        var matrix = Enumerable.Range(0, order).Select((_) => Enumerable.Repeat(0.0, order).ToList()).ToList();

        for (int row = 0; row < order; ++row)
        {
            for (int col = 0; col < order; ++col)
            {
                if (row != col)
                {
                    matrix[row][col] = rand.NextDouble();
                }
            }
        }
        return new ListDistanceMatrix(matrix);
    }

    public static IPrecedenceMatrix GenerateRandomPrecedenceMatrix(int order, double probability)
    {
        var rand = new Random();

        var matrix = Enumerable.Range(0, order).Select((_) => Enumerable.Repeat(false, order).ToList()).ToList();

        // the last two items are always st!

        for (int row = 0; row < order - 3; ++row)
        {
            for (int col = row + 1; col < order - 2; ++col)
            {
                if (rand.NextDouble() < probability)
                {
                    matrix[row][col] = true;
                }
            }
        }

        // (s -> ?) edges

        var sourceRow = order - 2;

        for (int col = 0; col < order; ++col)
        {
            if (sourceRow != col)
            {
                matrix[sourceRow][col] = true;
            }
        }

        // (? -> t) edges

        var targetCol = order - 1;

        for (int row = 0; row < order - 1; ++row)
        {
            matrix[row][targetCol] = true;
        }
        return new ListPrecedenceMatrix(TransitiveClosure.Closure(matrix), true);
    }

    public static List<SolverPlace> GetWaypoints(int count)
    {
        // [(0, 0), ..., (0, N-1), (1, 0), ..., (1, N-2), ...]

        var places = new List<SolverPlace>();

        for (int idx = 0; idx < count; ++idx)
        {
            for (int cat = 0; cat < count - idx; ++cat)
            {
                places.Add(new(idx, cat));
            }
        }
        return places;
    }
}
