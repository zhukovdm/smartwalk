using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text.RegularExpressions;
using MongoDB.Bson;
using MongoDB.Driver;
using SmartWalk.Core.Entities;

namespace SmartWalk.Infrastructure.EntityIndex.Mongo;

using B = FilterDefinitionBuilder<ExtendedPlace>;
using F = FilterDefinition<ExtendedPlace>;
using EE = Expression<Func<ExtendedPlace, object>>;
using EB = Expression<Func<ExtendedPlace, bool?>>;
using EC = Expression<Func<ExtendedPlace, IEnumerable<string>>>;
using ET = Expression<Func<ExtendedPlace, string>>;
using EN = Expression<Func<ExtendedPlace, double?>>;

/// <summary>
/// Mongo-specific filter definition.
/// </summary>
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
        filter = (x is null || x.inc.Count == 0)
            ? filter
            : filter & builder.AnyIn(expr, x.inc);

        filter = (x is null || x.exc.Count == 0)
            ? filter
            : filter & builder.Not(builder.AnyIn(expr, x.exc));

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

        if (fs.es is not null) {
            filter = filter
                .existen(builder, fs.es.image, p => p.attributes.image)
                .existen(builder, fs.es.description, p => p.attributes.description)
                .existen(builder, fs.es.website, p => p.attributes.website)
                .existen(builder, fs.es.address, p => p.attributes.address)
                .existen(builder, fs.es.email, p => p.attributes.email)
                .existen(builder, fs.es.phone, p => p.attributes.phone)
                .existen(builder, fs.es.socialNetworks, p => p.attributes.socialNetworks)
                .existen(builder, fs.es.charge, p => p.attributes.charge)
                .existen(builder, fs.es.openingHours, p => p.attributes.openingHours);
        }

        if (fs.bs is not null) {
            filter = filter
                .boolean(builder, fs.bs.fee, p => p.attributes.fee)
                .boolean(builder, fs.bs.delivery, p => p.attributes.delivery)
                .boolean(builder, fs.bs.drinkingWater, p => p.attributes.drinkingWater)
                .boolean(builder, fs.bs.internetAccess, p => p.attributes.internetAccess)
                .boolean(builder, fs.bs.shower, p => p.attributes.shower)
                .boolean(builder, fs.bs.smoking, p => p.attributes.smoking)
                .boolean(builder, fs.bs.takeaway, p => p.attributes.takeaway)
                .boolean(builder, fs.bs.toilets, p => p.attributes.toilets)
                .boolean(builder, fs.bs.wheelchair, p => p.attributes.wheelchair);
        }

        if (fs.ns is not null) {
            filter = filter
                .numeric(builder, fs.ns.capacity, p => p.attributes.capacity)
                .numeric(builder, fs.ns.elevation, p => p.attributes.elevation)
                .numeric(builder, fs.ns.minimumAge, p => p.attributes.minimumAge)
                .numeric(builder, fs.ns.rating, p => p.attributes.rating)
                .numeric(builder, fs.ns.year, p => p.attributes.year);
        }

        if (fs.ts is not null) {
            filter = filter
                .textual(builder, fs.ts.name, p => p.name);
        }

        if (fs.cs is not null) {
            filter = filter
                .collect(builder, fs.cs.clothes, p => p.attributes.clothes)
                .collect(builder, fs.cs.cuisine, p => p.attributes.cuisine)
                .collect(builder, fs.cs.denomination, p => p.attributes.denomination)
                .collect(builder, fs.cs.payment, p => p.attributes.payment)
                .collect(builder, fs.cs.rental, p => p.attributes.rental);
        }

        return filter;
    }
}
