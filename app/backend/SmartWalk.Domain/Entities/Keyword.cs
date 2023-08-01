using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SmartWalk.Domain.Entities;

public class Keyword
{
    [Required]
    public string label { get; set; }

    [Required]
    public List<string> attributeList { get; set; }
}
