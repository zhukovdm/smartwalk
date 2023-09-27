using System;
using System.Collections.Generic;
using System.Linq;
using SmartWalk.Core.Algorithms;
using SmartWalk.Core.Extensions;
using SmartWalk.Model.Entities;
using SmartWalk.Model.Interfaces;

namespace SmartWalk.Core.Test;

static class TestPrimitives
{
    public static List<List<double>> GetUnitDistanceMatrix(int order)
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

    public static IDistanceMatrix GetRandomDistanceMatrix(int order)
    {
        var N = order + 2;
        var rand = new Random();

        var matrix = Enumerable.Range(0, N).Select((_) => Enumerable.Repeat(0.0, N).ToList()).ToList();

        for (int row = 0; row < N; ++row)
        {
            for (int col = 0; col < N; ++col)
            {
                if (row != col)
                {
                    matrix[row][col] = rand.NextDouble();
                }
            }
        }
        return new ListDistanceMatrix(matrix);
    }

    public static IPrecedenceMatrix GetRandomPrecedenceMatrix(int order)
    {
        var N = order + 2;
        var rand = new Random();

        var topo = Enumerable.Range(0, N).ToList().DurstenfeldShuffle();
        var matrix = Enumerable.Range(0, N).Select((_) => Enumerable.Repeat(false, N).ToList()).ToList();

        for (int row = 0; row < order - 1; ++row)
        {
            for (int col = 0; col < order; ++col)
            {
                if (rand.NextDouble() < 0.5)
                {
                    matrix[row][col] = true;
                }
            }
        }

        // st-edges

        for (int row = 0; row < N - 1; ++row)
        {
            matrix[row][N - 1] = true;
        }

        for (int col = 0; col < N; ++col)
        {
            var row = N - 2;

            if (row != col)
            {
                matrix[row][col] = true;
            }
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
