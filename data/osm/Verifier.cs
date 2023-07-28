namespace osm;

internal static class Verifier
{
    public static bool IsNonTrivialString(string s) => s is not null && s != string.Empty;
}
