import { ExtendedPlace, PlaceLinked } from "../domain/types";

function extractLinked(linked: PlaceLinked): string[] {
  const {
    dbpedia,
    geonames,
    mapycz,
    osm,
    wikidata,
    yago
  } = linked;

  const res: string[] = [];

  if (!!dbpedia) {
    res.push(`http://dbpedia.org/resource/${dbpedia}`);
  }

  if (!!geonames) {
    res.push(`https://www.geonames.org/${geonames}`)
  }

  if (!!mapycz) {
    res.push(`https://mapy.cz/zakladni?source=${mapycz}`);
  }

  if (!!osm) {
    res.push(`https://www.openstreetmap.org/${osm}`);
  }

  if (!!wikidata) {
    res.push(`http://www.wikidata.org/entity/${wikidata}`);
  }

  if (!!yago) {
    res.push(`http://yago-knowledge.org/resource/${yago}`);
  }

  return res;
}

/**
 * @param url Resource location
 * @param place Place that defines json-ld object
 * @returns Semantically sound json-ld object.
 */
export const getJsonLdPlace = (url: string, place: ExtendedPlace): any => {

  const {
    name,
    location
  } = place;
  const { lon, lat } = location;

  return JSON.stringify({
    "@context": {
      "geo": "http://www.w3.org/2003/01/geo/wgs84_pos#",
      "owl": "http://www.w3.org/2002/07/owl#",
      "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
      "schema": "https://schema.org/",
      "xsd": "http://www.w3.org/2001/XMLSchema#",
      "name": {
        "@id": "rdfs:label",
        "@type": "xsd:string"
      },
      "lon": {
        "@id": "geo:long",
        "@type": "xsd:double"
      },
      "lat": {
        "@id": "geo:lat",
        "@type": "xsd:double"
      },
      "keywords": {
        "@id": "schema:keywords",
        "@type": "xsd:string"
      },
      "sameAs": {
        "@id": "owl:sameAs",
        "@type": "@id"
      }
    },
    "@id": url,
    name: name,
    lon: lon,
    lat: lat,
    keywords: place.keywords,
    sameAs: extractLinked(place.linked)
  });
};
