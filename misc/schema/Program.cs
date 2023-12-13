using System.IO;
using NJsonSchema;
using SmartWalk.Application.Entities;

namespace schema;

public class Program
{
    private static void Save(string file, string json)
    {
        File.WriteAllText(file, json);
    }

    public static void Main(string[] args)
    {
        {
            var s = JsonSchema.FromType<SearchDirecsQuery>();
            var j = s.ToJson(Newtonsoft.Json.Formatting.Indented);
            Save("direcs.json", j);
        }
        {
            var s = JsonSchema.FromType<SearchPlacesQuery>();
            var j = s.ToJson(Newtonsoft.Json.Formatting.Indented);
            Save("places.json", j);
        }
        {
            var s = JsonSchema.FromType<SearchRoutesQuery>();
            var j = s.ToJson(Newtonsoft.Json.Formatting.Indented);
            Save("routes.json", j);
        }
    }
}
