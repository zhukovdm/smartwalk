using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;
using MongoDB.Driver.GeoJsonObjectModel;
using SmartWalk.Domain.Entities;
using SmartWalk.Domain.Interfaces;
using SmartWalk.Infrastructure.EntityIndex.Mongo;

namespace SmartWalk.Infrastructure.EntityIndex;

using Filter = FilterDefinition<ExtendedPlace>;

internal sealed class MongoEntityIndex : MongoService, IEntityIndex
{
    private MongoEntityIndex(IMongoDatabase database) : base(database) { }

    private static IEnumerable<T> Deserialize<T>(List<BsonDocument> docs)
        => docs.Select((doc) => BsonSerializer.Deserialize<T>(doc)).ToList();

    /// <summary>
    /// Place-specific fetch.
    /// </summary>
    /// <param name="filter"></param>
    /// <param name="offset"></param>
    /// <param name="bucket"></param>
    /// <returns>List of places that satisfy at least one category filter.</returns>
    private async Task<List<Place>> FetchAround(Filter filter, int offset, int bucket)
    {
        var docs = await _database
            .GetCollection<ExtendedPlace>(MongoDatabaseFactory.PLACE_COLL)
            .Find(filter)
            .Project(Builders<ExtendedPlace>.Projection.Exclude(p => p.linked).Exclude(p => p.attributes))
            .Skip(offset).Limit(bucket)
            .ToListAsync();

        return Deserialize<Place>(docs).ToList();
    }

    public async Task<List<Place>> GetAround(
        WgsPoint center, double radius, IReadOnlyList<Category> categories, int offset, int bucket)
    {
        var sf = Builders<ExtendedPlace>.Filter
            .NearSphere(p => p.location, GeoJson.Point(new GeoJson2DGeographicCoordinates(center.lon, center.lat)), maxDistance: radius);

        FilterDefinition<ExtendedPlace> cf = null;

        foreach (var category in categories)
        {
            var filter = FilterBuilder.CategoryToFilter(category);
            cf = (cf is null) ? filter : cf | filter ;
        }
        cf ??= Builders<ExtendedPlace>.Filter.Empty;

        return await FetchAround(sf & cf, offset, bucket);
    }

    /// <summary>
    /// Route-specific fetch with merge.
    /// </summary>
    /// <param name="baseFilter"></param>
    /// <param name="catFilters"></param>
    /// <param name="bucket"></param>
    private async Task<List<Place>> FetchAroundWithin(Filter baseFilter, List<Filter> catFilters, int bucket)
    {
        var result = new Dictionary<string, Place>();

        for (int i = 0; i < catFilters.Count; ++i)
        {
            // Request database to obtain a list of places.

            var docs = await _database
                .GetCollection<ExtendedPlace>(MongoDatabaseFactory.PLACE_COLL)
                .Find(baseFilter & catFilters[i])
                .Project(Builders<ExtendedPlace>.Projection.Exclude(p => p.linked).Exclude(p => p.attributes))
                .Limit(bucket)
                .ToListAsync();

            // Convert BSON documents to proper places, add category identifier.

            var places = Deserialize<Place>(docs)
                .Select(p => { _ = p.categories.Add(i); return p; });

            /* Merge the list of places with the result in case the same place
            * is associated with more than one category. */

            foreach (var place in places)
            {
                if (result.TryGetValue(place.smartId, out var p))
                {
                    p.categories.Add(i);
                }
                else { result.Add(place.smartId, place); }
            }
        }

        return result.Values.ToList();
    }

    public async Task<List<Place>> GetAroundWithin(
        List<WgsPoint> polygon, WgsPoint refPoint, double distance, IReadOnlyList<Category> categories, int bucket)
    {
        /* Combine $geoWithin and $nearSphere filters to ensure points are
         * within the polygon and closed to the center of the circle. Typically
         * the circle is circumscribed about the polygon, and the polygon is
         * a bounding ellipse.
         * 
         *  - https://www.mongodb.com/docs/manual/reference/operator/query/geoWithin/
         *  - https://www.mongodb.com/docs/manual/reference/operator/query/nearSphere/
         */

        var sf = Builders<ExtendedPlace>.Filter
            .NearSphere(p => p.location, GeoJson.Point(new GeoJson2DGeographicCoordinates(refPoint.lon, refPoint.lat)), maxDistance: distance);

        var wf = Builders<ExtendedPlace>.Filter
            .GeoWithin(p => p.location, GeoJson.Polygon(polygon.Select(point => 
                new GeoJson2DGeographicCoordinates(point.lon, point.lat)).ToArray()));

        var catFilters = categories.Select((cat) => FilterBuilder.CategoryToFilter(cat)).ToList();

        return await FetchAroundWithin(sf & wf, catFilters, bucket);
    }

    public static IEntityIndex GetInstance(IMongoDatabase database) => new MongoEntityIndex(database);
}
