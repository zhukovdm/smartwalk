using System;
using System.Linq;
using NJsonSchema;

public static class SerializationValidator<T>
{
    private static readonly JsonSchema _schema = JsonSchema.FromType<T>();

    public static bool Validate(string serialization, out string[] errors)
    {
        try
        {
            errors = _schema.Validate(serialization)
                .Select((error) => $"{error.Kind} at {error.Path}, line {error.LineNumber}, position {error.LinePosition}.").ToArray();
        }
        catch (Exception) { errors = new[] { "Invalid serialization." }; }

        return errors.Length == 0;
    }
}
