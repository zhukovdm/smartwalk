using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SmartWalk.Domain.Entities;

public class KeywordsAdviceItem
{
    /// <example>museum</example>
    [Required]
    public string keyword { get; set; }

    /// <example>["openingHours"]</example>
    [Required]
    public List<string> attributeList { get; set; }
}
