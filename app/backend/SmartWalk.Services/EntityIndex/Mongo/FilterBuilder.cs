using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text.RegularExpressions;
using MongoDB.Bson;
using MongoDB.Driver;
using SmartWalk.Domain.Entities;

namespace SmartWalk.Services.EntityIndex.Mongo;

using B = FilterDefinitionBuilder<ExtendedPlace>;
using F = FilterDefinition<ExtendedPlace>;
using EE = Expression<Func<ExtendedPlace, object>>;
using EB = Expression<Func<ExtendedPlace, bool?>>;
using EC = Expression<Func<ExtendedPlace, IEnumerable<string>>>;
using ET = Expression<Func<ExtendedPlace, string>>;
using EN = Expression<Func<ExtendedPlace, double?>>;

internal static class FilterDefinitionExtensions
{
    public static F existen(this F filter, B builder, object x, EE expr)
        => (x is null) ? filter : filter & builder.Exists(expr);

    public static F boolean(this F filter, B builder, bool? x, EB expr)
        => (x is null) ? filter : filter & builder.Eq(expr, x);

    public static F numeric(this F filter, B builder, AttributeFilterNumeric x, EN expr)
        => (x is null) ? filter : filter & builder.Gte(expr, x.min) & builder.Lte(expr, x.max);

    public static F textual(this F filter, B builder, string x, ET expr)
        => (x is null) ? filter : filter & builder.StringIn(expr, new BsonRegularExpression(Regex.Escape(x), "i"));

    public static F collect(this F filter, B builder, AttributeFilterCollect x, EC expr)
    {
        filter = (x is null || x.includes.Count == 0)
            ? filter
            : filter & builder.AnyIn(expr, x.includes);

        filter = (x is null || x.excludes.Count == 0)
            ? filter
            : filter & builder.Not(builder.AnyIn(expr, x.excludes));

        return filter;
    }
}

internal static class FilterBuilder
{
    ///<summary>
    /// Construct filter out of the provided category.
    ///</summary>
    public static F CategoryToFilter(Category category)
    {
        var fs = category.filters;
        var builder = Builders<ExtendedPlace>.Filter;

        var filter = builder.Empty;

        filter = filter & builder.AnyEq(o => o.keywords, category.keyword);

        filter = filter
            .existen(builder, fs.existens.image, p => p.attributes.image)
            .existen(builder, fs.existens.description, p => p.attributes.description)
            .existen(builder, fs.existens.website, p => p.attributes.website)
            .existen(builder, fs.existens.address, p => p.attributes.address)
            .existen(builder, fs.existens.email, p => p.attributes.email)
            .existen(builder, fs.existens.phone, p => p.attributes.phone)
            .existen(builder, fs.existens.socialNetworks, p => p.attributes.socialNetworks)
            .existen(builder, fs.existens.charge, p => p.attributes.charge)
            .existen(builder, fs.existens.openingHours, p => p.attributes.openingHours);

        filter = filter
            .boolean(builder, fs.booleans.fee, p => p.attributes.fee)
            .boolean(builder, fs.booleans.delivery, p => p.attributes.delivery)
            .boolean(builder, fs.booleans.drinkingWater, p => p.attributes.drinkingWater)
            .boolean(builder, fs.booleans.internetAccess, p => p.attributes.internetAccess)
            .boolean(builder, fs.booleans.shower, p => p.attributes.shower)
            .boolean(builder, fs.booleans.smoking, p => p.attributes.smoking)
            .boolean(builder, fs.booleans.takeaway, p => p.attributes.takeaway)
            .boolean(builder, fs.booleans.toilets, p => p.attributes.toilets)
            .boolean(builder, fs.booleans.wheelchair, p => p.attributes.wheelchair);

        filter = filter
            .numeric(builder, fs.numerics.capacity, p => p.attributes.capacity)
            .numeric(builder, fs.numerics.elevation, p => p.attributes.elevation)
            .numeric(builder, fs.numerics.minimumAge, p => p.attributes.minimumAge)
            .numeric(builder, fs.numerics.rating, p => p.attributes.rating)
            .numeric(builder, fs.numerics.year, p => p.attributes.year);

        filter = filter
            .textual(builder, fs.textuals.name, p => p.name);

        filter = filter
            .collect(builder, fs.collects.clothes, p => p.attributes.clothes)
            .collect(builder, fs.collects.cuisine, p => p.attributes.cuisine)
            .collect(builder, fs.collects.denomination, p => p.attributes.denomination)
            .collect(builder, fs.collects.payment, p => p.attributes.payment)
            .collect(builder, fs.collects.rental, p => p.attributes.rental);

        return filter;
    }
}
