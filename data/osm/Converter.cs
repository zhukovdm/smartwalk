namespace osm;

internal static class Converter
{
    public static string SnakeToKeyword(string snake) => snake.Replace('_', ' ');
}
