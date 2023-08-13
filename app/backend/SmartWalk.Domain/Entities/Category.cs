using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SmartWalk.Domain.Entities;

public sealed class AttributeFilterExisten { }

public sealed class AttributeFilterExistens
{
    public AttributeFilterExisten image { get; set; }

    public AttributeFilterExisten description { get; set; }

    public AttributeFilterExisten website { get; set; }

    public AttributeFilterExisten address { get; set; }

    public AttributeFilterExisten email { get; set; }

    public AttributeFilterExisten phone { get; set; }

    public AttributeFilterExisten socialNetworks { get; set; }

    public AttributeFilterExisten charge { get; set; }

    public AttributeFilterExisten openingHours { get; set; }
}

public sealed class AttributeFilterBooleans
{
    public bool? fee { get; set; }

    public bool? delivery { get; set; }

    public bool? drinkingWater { get; set; }

    public bool? internetAccess { get; set; }

    public bool? shower { get; set; }

    public bool? smoking { get; set; }

    public bool? takeaway { get; set; }

    public bool? toilets { get; set; }

    public bool? wheelchair { get; set; }
}

public sealed class AttributeFilterNumeric
{
    [Required]
    public double? min { get; set; }

    [Required]
    public double? max { get; set; }
}

public sealed class AttributeFilterNumerics
{
    public AttributeFilterNumeric capacity { get; set; }

    public AttributeFilterNumeric elevation { get; set; }

    public AttributeFilterNumeric minimumAge { get; set; }

    public AttributeFilterNumeric rating { get; set; }

    public AttributeFilterNumeric year { get; set; }
}

public sealed class AttributeFilterTextuals
{
    public string name { get; set; }
}

public sealed class AttributeFilterCollect
{
    [Required]
    public SortedSet<string> inc { get; set; }

    [Required]
    public SortedSet<string> exc { get; set; }
}

public sealed class AttributeFilterCollects
{
    public AttributeFilterCollect clothes { get; set; }

    public AttributeFilterCollect cuisine { get; set; }

    public AttributeFilterCollect denomination { get; set; }

    public AttributeFilterCollect payment { get; set; }

    public AttributeFilterCollect rental { get; set; }
}

public sealed class AttributeFilters
{
    public AttributeFilterExistens es { get; set; }

    public AttributeFilterBooleans bs { get; set; }

    public AttributeFilterNumerics ns { get; set; }

    public AttributeFilterTextuals ts { get; set; }

    public AttributeFilterCollects cs { get; set; }
}

public sealed class Category
{
    /// <summary>
    /// Consider places identified as <c>keyword</c>.
    /// </summary>
    [Required]
    public string keyword { get; set; }

    /// <summary>
    /// Additional attribute filters introduced by the user.
    /// </summary>
    [Required]
    public AttributeFilters filters { get; set; }
}
