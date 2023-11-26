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

    public static IDistanceFunction GenerateRandomDistanceMatrix(int order)
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
        return new MatrixDistanceFunction(matrix);
    }

    public static IReadOnlyList<Arrow> GenerateRandomArrows(int order, double probability)
    {
        // graph has to be acyclic!

        var random = new Random();
        var arrows = new List<Arrow>();

        // the last two items are always st!

        for (int row = 0; row < order - 3; ++row)
        {
            for (int col = row + 1; col < order - 2; ++col)
            {
                if (random.NextDouble() < probability)
                {
                    arrows.Add(new(row, col));
                }
            }
        }

        return arrows;
    }

    public static IReadOnlyList<IReadOnlyList<bool>> GetTransitiveClosure(int order, IReadOnlyList<Arrow> arrows)
    {
        var matrix = Enumerable.Range(0, order).Select((_) => Enumerable.Repeat(false, order).ToList()).ToList();

        foreach(var arrow in arrows)
        {
            matrix[arrow.fr][arrow.to] = true;
        }

        for (int k = 0; k < order; ++k)
        {
            for (int i = 0; i < order; ++i)
            {
                for (int j = 0; j < order; ++j)
                {
                    matrix[i][j] = matrix[i][j] || (matrix[i][k] && matrix[k][j]);
                }
            }
        }

        return matrix;
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
