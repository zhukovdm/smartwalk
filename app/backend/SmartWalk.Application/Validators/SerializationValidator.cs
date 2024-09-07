using System;
using System.Linq;
using NJsonSchema;

namespace SmartWalk.Application.Validators;

/// <summary>
/// Schema-based validator (defined by type attributes).
/// </summary>
/// <typeparam name="V">Input string is validated against V-type</typeparam>
public static class SerializationValidator<V>
{
    private static readonly JsonSchema schema = JsonSchema.FromType<V>();

    public static bool Validate(string serialization, out string[] errors)
    {
        try
        {
            errors = schema.Validate(serialization)
                .Select((error) => $"{error.Kind} at {error.Path}, line {error.LineNumber}, position {error.LinePosition}.").ToArray();
        }
        catch (Exception) { errors = new[] { "Invalid serialization." }; }

        return errors.Length == 0;
    }
}
