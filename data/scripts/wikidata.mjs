import jsonld from "jsonld";

const WIKIDATA_ACCEPT_CONTENT = "application/n-quads";
const WIKIDATA_SPARQL_ENDPOINT = "https://query.wikidata.org/sparql";

const WIKIDATA_JSONLD_CONTEXT = {
  "my": "http://example.com/",
  "wd": "http://www.wikidata.org/entity/",
  "geo": "http://www.opengis.net/ont/geosparql#",
  "xsd": "http://www.w3.org/2001/XMLSchema#",
  "name": {
    "@id": "my:name",
    "@container": "@language"
  },
  "location": {
    "@id": "my:location",
    "@type": "geo:wktLiteral"
  },
  "description": {
    "@id": "my:description",
    "@container": "@language"
  },
  "genre": {
    "@id": "my:genre",
    "@container": "@language"
  },
  "instance": {
    "@id": "my:instance",
    "@container": "@language"
  },
  "facility": {
    "@id": "my:facility",
    "@container": "@language"
  },
  "movement": {
    "@id": "my:movement",
    "@container": "@language"
  },
  "archStyle": {
    "@id": "my:archStyle",
    "@container": "@language"
  },
  "fieldWork": {
    "@id": "my:fieldWork",
    "@container": "@language"
  },
  "image": {
    "@id": "my:image",
    "@type": "@id"
  },
  "email": {
    "@id": "my:email",
    "@type": "@id"
  },
  "phone": {
    "@id": "my:phone"
  },
  "website": {
    "@id": "my:website",
    "@type": "@id"
  },
  "facebook": {
    "@id": "my:facebook"
  },
  "instagram": {
    "@id": "my:instagram"
  },
  "linkedin": {
    "@id": "my:linkedin"
  },
  "pinterest": {
    "@id": "my:pinterest"
  },
  "telegram": {
    "@id": "my:telegram"
  },
  "twitter": {
    "@id": "my:twitter"
  },
  "youtube": {
    "@id": "my:youtube"
  },
  "inception": {
    "@id": "my:inception",
    "@type": "xsd:dateTime"
  },
  "openingDate": {
    "@id": "my:openingDate",
    "@type": "xsd:dateTime"
  },
  "capacity": {
    "@id": "my:capacity",
    "@type": "xsd:decimal"
  },
  "elevation": {
    "@id": "my:elevation",
    "@type": "xsd:decimal"
  },
  "minimumAge": {
    "@id": "my:minimumAge",
    "@type": "xsd:decimal"
  },
  "geonames": {
    "@id": "my:geonames"
  },
  "mapycz": {
    "@id": "my:mapycz"
  },
  "country": {
    "@id": "my:country",
    "@container": "@language"
  },
  "street": {
    "@id": "my:street",
    "@container": "@language"
  },
  "house": {
    "@id": "my:house"
  },
  "postalCode": {
    "@id": "my:postalCode"
  },
  "wikidata": "@id"
};

/**
 * @param {*} query SPARQL query compliant with Wikidata KG.
 * @returns Graph represented as a list of entities.
 */
export function fetchListFromWikidata(query) {

  return fetch(WIKIDATA_SPARQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Accept": WIKIDATA_ACCEPT_CONTENT + "; charset=utf-8",
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "GrainPath (https://github.com/grainpath)"
    },
    body: "query=" + encodeURIComponent(query)
  })
  .then((res) => res.text())
  .then((txt) => jsonld.fromRDF(txt, { format: WIKIDATA_ACCEPT_CONTENT }))
  .then((doc) => jsonld.compact(doc, WIKIDATA_JSONLD_CONTEXT))
  .then((jsn) => jsn["@graph"] ?? []);
}
