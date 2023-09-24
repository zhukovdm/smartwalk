using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SmartWalk.Domain.Entities;

public sealed class AttributeFilterExisten { }

public sealed class AttributeFilterExistens
{
    public AttributeFilterExisten description { get; init; }

    public AttributeFilterExisten image { get; init; }

    public AttributeFilterExisten website { get; init; }

    public AttributeFilterExisten address { get; init; }

    public AttributeFilterExisten email { get; init; }

    public AttributeFilterExisten phone { get; init; }

    public AttributeFilterExisten socialNetworks { get; init; }

    public AttributeFilterExisten charge { get; init; }

    public AttributeFilterExisten openingHours { get; init; }
}

public sealed class AttributeFilterBooleans
{
    public bool? fee { get; init; }

    public bool? delivery { get; init; }

    public bool? drinkingWater { get; init; }

    public bool? internetAccess { get; init; }

    public bool? shower { get; init; }

    public bool? smoking { get; init; }

    public bool? takeaway { get; init; }

    public bool? toilets { get; init; }

    public bool? wheelchair { get; init; }
}

public sealed class AttributeFilterNumeric
{
    [Required]
    public double? min { get; init; }

    [Required]
    public double? max { get; init; }
}

public sealed class AttributeFilterNumerics
{
    public AttributeFilterNumeric capacity { get; init; }

    public AttributeFilterNumeric elevation { get; init; }

    public AttributeFilterNumeric minimumAge { get; init; }

    public AttributeFilterNumeric rating { get; init; }

    public AttributeFilterNumeric year { get; init; }
}

public sealed class AttributeFilterTextuals
{
    public string name { get; init; }
}

public sealed class AttributeFilterCollect
{
    /// <summary>
    /// Collection shall include any of these items.
    /// </summary>
    [Required]
    public SortedSet<string> inc { get; init; }

    /// <summary>
    /// Collection shall exclude all of these items.
    /// </summary>
    [Required]
    public SortedSet<string> exc { get; init; }
}

public sealed class AttributeFilterCollects
{
    public AttributeFilterCollect clothes { get; init; }

    public AttributeFilterCollect cuisine { get; init; }

    public AttributeFilterCollect denomination { get; init; }

    public AttributeFilterCollect payment { get; init; }

    public AttributeFilterCollect rental { get; init; }
}

public sealed class AttributeFilters
{
    public AttributeFilterExistens es { get; init; }

    public AttributeFilterBooleans bs { get; init; }

    public AttributeFilterNumerics ns { get; init; }

    public AttributeFilterTextuals ts { get; init; }

    public AttributeFilterCollects cs { get; init; }
}

public sealed class Category
{
    /// <summary>
    /// Consider places identified as <c>keyword</c>.
    /// </summary>
    [Required]
    public string keyword { get; init; }

    /// <summary>
    /// Additional attribute filters introduced by the user.
    /// </summary>
    [Required]
    public AttributeFilters filters { get; init; }
}
