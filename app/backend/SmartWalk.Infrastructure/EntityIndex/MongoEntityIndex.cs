using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;
using MongoDB.Driver.GeoJsonObjectModel;
using SmartWalk.Core.Extensions;
using SmartWalk.Infrastructure.EntityIndex.Mongo;
using SmartWalk.Model.Entities;
using SmartWalk.Model.Interfaces;

namespace SmartWalk.Infrastructure.EntityIndex;

using Filter = FilterDefinition<ExtendedPlace>;

public sealed class MongoEntityIndex : IEntityIndex
{
    private readonly IMongoCollection<ExtendedPlace> _collection;

    private MongoEntityIndex(IMongoCollection<ExtendedPlace> collection)
    {
        _collection = collection;
    }

    private static IEnumerable<T> Deserialize<T>(List<BsonDocument> docs)
        => docs.Select((doc) => BsonSerializer.Deserialize<T>(doc));

    /// <summary>
    /// General-purpose fetch.
    /// </summary>
    /// <param name="filter"></param>
    /// <param name="categoryId"></param>
    /// <returns>List of places that satisfy at least one category filter.</returns>
    private async Task<List<Place>> FetchPlaces(Filter filter, int? categoryId)
    {
        var docs = await _collection
            .Find(filter)
            .Project(Builders<ExtendedPlace>.Projection
                .Exclude(p => p.linked)
                .Exclude(p => p.attributes))
            .ToListAsync();

        var places = Deserialize<Place>(docs).Select((place) => {
            if (categoryId is not null) { _ = place.categories.Add(categoryId.Value); }
            return place;
        }).ToList();

        return places;
    }

    private async Task<List<Place>> FetchCategories(Filter baseFilter, IReadOnlyList<Category> categories)
    {
        var result = new List<Place>();

        for (int i = 0; i < categories.Count; ++i)
        {
            result.AddRange(await FetchPlaces(
                baseFilter & FilterBuilder.CategoryToFilter(categories[i]), i));
        }
        return result.WithMergedCategories();
    }

    public Task<List<Place>> GetAround(WgsPoint center, double radius, IReadOnlyList<Category> categories)
    {
        // $nearSphere returns objects sorted by distance from the center!

        var sf = Builders<ExtendedPlace>.Filter
            .NearSphere(p => p.location, GeoJson.Point(
                new GeoJson2DGeographicCoordinates(center.lon, center.lat)), maxDistance: radius);

        return categories.Count != 0
            ? FetchCategories(sf, categories)
            : FetchPlaces(sf & Builders<ExtendedPlace>.Filter.Empty, null); // special case!
    }

    public Task<List<Place>> GetWithin(IReadOnlyList<WgsPoint> polygon, IReadOnlyList<Category> categories)
    {
        // $geoWithin does not sort objects.

        var wf = Builders<ExtendedPlace>.Filter
            .GeoWithin(p => p.location, GeoJson.Polygon(polygon.Select(point => 
                new GeoJson2DGeographicCoordinates(point.lon, point.lat)).ToArray()));

        return FetchCategories(wf, categories);
    }

    public static IEntityIndex GetInstance()
    {
        var coll = MongoCollectionFactory.GetPlaceCollection();
        return new MongoEntityIndex(coll);
    }
}
