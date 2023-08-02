using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SmartWalk.Domain.Entities;

public class Keyword
{
    /// <example>museum</example>
    [Required]
    public string label { get; set; }

    /// <example>["openingHours"]</example>
    [Required]
    public List<string> attributeList { get; set; }
}
