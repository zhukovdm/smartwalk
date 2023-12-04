import axios from "axios";
import jsonld, { type ContextDefinition } from "jsonld";
import {
  EnrichLogger,
  EnrichSource,
  ensureArray,
  getFirst,
  isValidKeyword
} from "../../shared/dist/src/index.js";

const WIKIDATA_ACCEPT_CONTENT = "application/n-quads";

const WIKIDATA_SPARQL_ENDPOINT = "https://query.wikidata.org/sparql";

/**
 * Note that {`@container`: `@language`} is a valid definition even though d.ts
 * does not recognize it.
 *  - https://www.w3.org/TR/json-ld11/#example-71-language-map-expressing-a-property-in-three-languages
 */
const WIKIDATA_JSONLD_CONTEXT = {
  "my": "http://example.com/",
  "wd": "http://www.wikidata.org/entity/",
  "geo": "http://www.opengis.net/ont/geosparql#",
  "xsd": "http://www.w3.org/2001/XMLSchema#",
  "name": {
    "@id": "my:name",
    "@container": "@language"
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
} as ContextDefinition;

/**
 * @param payload List of identifiers.
 * @returns Query as a string.
 */
function getWikidataQuery(payload: string[]): string {
  return `PREFIX dct: <http://purl.org/dc/terms/>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX my: <http://example.com/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX schema: <http://schema.org/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
CONSTRUCT {
  ?wikidataId
    my:name ?name;
    my:description ?description;
    my:genre ?genre;
    my:instance ?instance;
    my:facility ?facility;
    my:movement ?movement;
    my:archStyle ?archStyle;
    my:fieldWork ?fieldWork;
    my:image ?image;
    my:email ?email;
    my:phone ?phone;
    my:website ?website;
    my:facebook ?facebookId;
    my:instagram ?instagramId;
    my:linkedin ?linkedinId;
    my:pinterest ?pinterestId;
    my:telegram ?telegramId;
    my:twitter ?twitterId;
    my:youtube ?youtubeId;
    my:inception ?inception;
    my:openingDate ?openingDate;
    my:capacity ?capacity;
    my:elevation ?elevation;
    my:minimumAge ?minimumAge;
    my:mapycz ?mapyCzId;
    my:geonames ?geoNamesId;
    my:country ?country;
    my:street ?street;
    my:house ?house;
    my:postalCode ?postalCode.
}
WHERE {
VALUES ?wikidataId { ${payload.join(" ")} }
OPTIONAL { 
  ?wikidataId rdfs:label | dct:title | foaf:name | skos:prefLabel | skos:altLabel ?name.
  FILTER(LANG(?name) = "en" && STRLEN(STR(?name)) > 0)
}
OPTIONAL {
  ?wikidataId schema:description | rdfs:comment ?description.
  FILTER(LANG(?description) = "en" && STRLEN(STR(?description)) > 0)
}
OPTIONAL {
  ?wikidataId wdt:P136 ?genreId.
  ?genreId rdfs:label ?genre.
  FILTER(LANG(?genre) = "en" && STRLEN(STR(?genre)) > 0)
}
OPTIONAL {
  ?wikidataId wdt:P31 ?instanceOf.
  ?instanceOf rdfs:label ?instance.
  FILTER(LANG(?instance) = "en" && STRLEN(STR(?instance)) > 0)
}
OPTIONAL {
  ?wikidataId wdt:P912 ?facilityId.
  ?facilityId rdfs:label ?facility.
  FILTER(LANG(?facility) = "en" && STRLEN(STR(?facility)) > 0)
}
OPTIONAL {
  ?wikidataId wdt:P135 ?movementId.
  ?movementId rdfs:label ?movement.
  FILTER(LANG(?movement) = "en" && STRLEN(STR(?movement)) > 0)
}
OPTIONAL {
  ?wikidataId wdt:P149 ?archStyleId.
  ?archStyleId rdfs:label ?archStyle.
  FILTER(LANG(?archStyle) = "en" && STRLEN(STR(?archStyle)) > 0)
}
OPTIONAL {
  ?wikidataId wdt:P101 ?fieldWorkId.
  ?fieldWorkId rdfs:label ?fieldWork.
  FILTER(LANG(?fieldWork) = "en" && STRLEN(STR(?fieldWork)) > 0)
}
OPTIONAL {
  ?wikidataId wdt:P18 ?image.
}
OPTIONAL {
  ?wikidataId wdt:P968 ?email.
}
OPTIONAL {
  ?wikidataId wdt:P1329 ?phone.
}
OPTIONAL {
  ?wikidataId wdt:P856 ?website.
}
OPTIONAL {
  ?wikidataId wdt:P2013 ?facebookId.
}
OPTIONAL {
  ?wikidataId wdt:P2003 ?instagramId.
}
OPTIONAL {
  ?wikidataId wdt:P4264 ?linkedinId.
}
OPTIONAL {
  ?wikidataId wdt:3836 ?pinterestId.
}
OPTIONAL {
  ?wikidataId wdt:P3789 ?telegramId.
}
OPTIONAL {
  ?wikidataId wdt:P2002 ?twitterId.
}
OPTIONAL {
  ?wikidataId wdt:P2397 ?youtubeId.
}
OPTIONAL {
  ?wikidataId wdt:P571 ?inception.
}
OPTIONAL {
  ?wikidataId wdt:P1619 ?openingDate.
}
OPTIONAL {
  ?wikidataId wdt:P1083 ?capacity.
}
OPTIONAL {
  ?wikidataId wdt:P2044 ?elevation.
}
OPTIONAL {
  ?wikidataId wdt:P2899 ?minimumAge.
}
OPTIONAL {
  ?wikidataId wdt:P8988 ?mapyCzId.
}
OPTIONAL {
  ?wikidataId wdt:P1566 ?geoNamesId.
}
OPTIONAL {
  ?wikidataId wdt:P17 ?countryId.
  ?countryId rdfs:label ?country.
  FILTER(LANG(?country) = "en" && STRLEN(STR(?country)) > 0)
}
OPTIONAL {
  ?wikidataId wdt:P669 ?streetId.
  ?streetId rdfs:label ?street.
  FILTER(LANG(?street) = "en" && STRLEN(STR(?street)) > 0)
}
OPTIONAL {
  ?wikidataId wdt:P4856 ?house.
}
OPTIONAL {
  ?wikidataId wdt:P281 ?postalCode.
}}`};

async function fetchFromWikidata(query: string): Promise<any[]> {

  // POST verb for long queries
  const res = await axios.post(WIKIDATA_SPARQL_ENDPOINT, "query=" + encodeURIComponent(query), {
    headers: {
      "Accept": `${WIKIDATA_ACCEPT_CONTENT}; charset=utf-8`,
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "SmartWalk (https://github.com/zhukovdm/smartwalk)"
    }
  });

  // empty graph
  if (res.data.length === 0) {
    return [];
  }

  const arr = await jsonld.fromRDF(res.data, {
    format: WIKIDATA_ACCEPT_CONTENT
  });
  const jsn = await jsonld.compact(arr, WIKIDATA_JSONLD_CONTEXT);
  return (jsn["@graph"] ?? []) as any[];
}

function handleKeywordArray(arr: { en: string | string[] } = { en: [] }) {
  return ensureArray(arr.en)
    .map((instance) => instance.toLowerCase())
    .map((instance) => isValidKeyword(instance) ? instance : undefined)
    .filter((instance) => instance !== undefined) as string[];
}

function handleDate(value: string) {
  const d = new Date(value).getFullYear();
  return isNaN(d) ? undefined : d;
}

function handleNumber(value: string) {
  const n = parseFloat(value);
  return isNaN(n) ? undefined : n;
}

function handleFacebook(value: string | undefined) {
  return value !== undefined ? `https://www.facebook.com/${value}` : undefined;
}

function handleInstagram(value: string | undefined) {
  return value !== undefined ? `https://www.instagram.com/${value}/` : undefined;
}

function handleLinkedin(value: string | undefined) {
  return value !== undefined ? `https://www.linkedin.com/in/${value}/` : undefined;
}

function handlePinterest(value: string | undefined) {
  return value !== undefined ? `https://www.pinterest.com/${value}/` : undefined;
}

function handleTelegram(value: string | undefined) {
  return value !== undefined ? `https://t.me/${value}` : undefined;
}

function handleTwitter(value: string | undefined) {
  return value !== undefined ? `https://twitter.com/${value}` : undefined;
}

function handleYoutube(value: string | undefined) {
  return value !== undefined ? `https://www.youtube.com/channel/${value}` : undefined;
}

function constructFromEntity(entity: any): any {
  const object = {} as any;

  const keywords = ([] as string[])
    .concat(handleKeywordArray(entity.genre))
    .concat(handleKeywordArray(entity.instance))
    .concat(handleKeywordArray(entity.facility))
    .concat(handleKeywordArray(entity.movement))
    .concat(handleKeywordArray(entity.archStyle))
    .concat(handleKeywordArray(entity.fieldWork));

  object.name = getFirst(entity.name?.en);
  object.description = getFirst(entity.description?.en);

  object.keywords = Array.from(new Set(keywords));

  // contacts
  object.image = getFirst(entity.image);
  object.email = getFirst(entity.email)?.substring(7); // mailto:
  object.phone = getFirst(entity.phone);
  object.website = getFirst(entity.website);

  object.facebook = handleFacebook(getFirst(entity.facebook));
  object.instagram = handleInstagram(getFirst(entity.instagram));
  object.linkedin = handleLinkedin(getFirst(entity.linkedin));
  object.pinterest = handlePinterest(getFirst(entity.pinterest));
  object.telegram = handleTelegram(getFirst(entity.telegram));
  object.twitter = handleTwitter(getFirst(entity.twitter));
  object.youtube = handleYoutube(getFirst(entity.youtube));

  // date
  object.year = handleDate(getFirst(entity.inception)) ?? handleDate(getFirst(entity.openingDate));

  // numbers
  object.capacity = handleNumber(getFirst(entity.capacity));
  object.elevation = handleNumber(getFirst(entity.elevation));
  object.minimumAge = handleNumber(getFirst(entity.minimumAge));

  object.country = getFirst(entity.country?.en);
  object.street = getFirst(entity.street?.en);
  object.house = getFirst(entity.house);
  object.postalCode = getFirst(entity.postalCode);

  // linked
  object.mapycz = getFirst(entity.mapycz);
  object.geonames = getFirst(entity.geonames);
  object.wikidata = entity.wikidata.substring(3); // cut wd:

  return object;
}

export default class Source extends EnrichSource {

  constructor(logger: EnrichLogger) {
    super(logger);
  }

  getQuery(items: string[]): string {
    return getWikidataQuery(items);
  }

  fetchFrom(query: string): Promise<any[]> {
    return fetchFromWikidata(query);
  }

  constructFromEntity(entity: any) {
    return constructFromEntity(entity);
  }
}
