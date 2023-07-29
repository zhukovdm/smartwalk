import { MongoClient } from "mongodb";
import {
  getFirst,
  getPayload,
  isValidKeyword,
  MONGO_CONN_STR,
  reportError,
  reportUpdatedItems,
  reportFinished,
  reportPayload,
  writeUpdateToDatabase
} from "./shared.cjs";
import { fetchListFromWikidata } from "./wikidata.mjs";

const wikidataQuery = (payload) => `PREFIX dct: <http://purl.org/dc/terms/>
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
VALUES ?wikidataId { ${payload} }
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
}}`;

function handleKeywordArray(list) {
  const arr = (a) => Array.isArray(a) ? a : [a];
  list = list ?? { "en": [] };

  return arr(list.en)
    .map((instance) => instance.toLowerCase())
    .map((instance) => isValidKeyword(instance) ? instance : undefined)
    .filter((instance) => instance !== undefined);
}

function handleDate(value) {
  const d = new Date(value).getFullYear();
  return isNaN(d) ? undefined : d;
}

function handleNumber(value) {
  const n = parseFloat(value);
  return isNaN(n) ? undefined : n;
}

function handleFacebook(value) {
  return value !== undefined ? `https://www.facebook.com/${value}` : undefined;
}

function handleInstagram(value) {
  return value !== undefined ? `https://www.instagram.com/${value}/` : undefined;
}

function handleLinkedin(value) {
  return value !== undefined ? `https://www.linkedin.com/in/${value}/` : undefined;
}

function handlePinterest(value) {
  return value !== undefined ? `https://www.pinterest.com/${value}/` : undefined;
}

function handleTelegram(value) {
  return value !== undefined ? `https://t.me/${value}` : undefined;
}

function handleTwitter(value) {
  return value !== undefined ? `https://twitter.com/${value}` : undefined;
}

function handleYoutube(value) {
  return value !== undefined ? `https://www.youtube.com/channel/${value}` : undefined;
}

function constructFromEntity(ent) {
  const obj = {};

  const keywords = []
    .concat(handleKeywordArray(ent.genre))
    .concat(handleKeywordArray(ent.instance))
    .concat(handleKeywordArray(ent.facility))
    .concat(handleKeywordArray(ent.movement))
    .concat(handleKeywordArray(ent.archStyle))
    .concat(handleKeywordArray(ent.fieldWork));

  obj.name = getFirst(ent.name?.en);
  obj.description = getFirst(ent.description?.en);

  obj.keywords = [...new Set(keywords)];

  // contacts
  obj.image = getFirst(ent.image);
  obj.email = getFirst(ent.email)?.substring(7); // mailto:
  obj.phone = getFirst(ent.phone);
  obj.website = getFirst(ent.website);

  obj.facebook = handleFacebook(getFirst(ent.facebook));
  obj.instagram = handleInstagram(getFirst(ent.instagram));
  obj.linkedin = handleLinkedin(getFirst(ent.linkedin));
  obj.pinterest = handlePinterest(getFirst(ent.pinterest));
  obj.telegram = handleTelegram(getFirst(ent.telegram));
  obj.twitter = handleTwitter(getFirst(ent.twitter));
  obj.youtube = handleYoutube(getFirst(ent.youtube));

  // date
  obj.year = handleDate(getFirst(ent.inception)) ?? handleDate(getFirst(ent.openingDate));

  // numbers
  obj.capacity = handleNumber(getFirst(ent.capacity));
  obj.elevation = handleNumber(getFirst(ent.elevation));
  obj.minimumAge = handleNumber(getFirst(ent.minimumAge));

  obj.country = getFirst(ent.country?.en);
  obj.street = getFirst(ent.street?.en);
  obj.house = getFirst(ent.house);
  obj.postalCode = getFirst(ent.postalCode);

  // linked
  obj.mapycz = getFirst(ent.mapycz);
  obj.geonames = getFirst(ent.geonames);
  obj.wikidata = ent.wikidata.substring(3); // cut wd:

  return obj;
}

/**
 * Enrich entities already existing in the database.
 */
async function wikidataEnrich() {

  let cnt = 0;
  const resource = "Wikidata";
  const client = new MongoClient(MONGO_CONN_STR);

  try {
    let payload = await getPayload(client);
    reportPayload(payload, resource);

    const WINDOW = 100;
    const TOT = payload.length;

    while (payload.length) {

      const piece = payload.slice(0, WINDOW);
      cnt += piece.length;

      const qry = wikidataQuery(piece.join(' '));
      const lst = await fetchListFromWikidata(qry)
        .then((lst) => lst.map((e) => constructFromEntity(e)));

      const upd = (obj) => {
        return {
          $set: {
            "name": obj.name,
            "attributes.description": obj.description,
            "attributes.image": obj.image,
            "attributes.email": obj.email,
            "attributes.phone": obj.phone,
            "attributes.website": obj.website,
            "attributes.year": obj.year,
            "attributes.capacity": obj.capacity,
            "attributes.elevation": obj.elevation,
            "attributes.minimumAge": obj.minimumAge,
            "attributes.address.country": obj.country,
            "attributes.address.place": obj.street,
            "attributes.address.house": obj.house,
            "attributes.address.postalCode": obj.postalCode,
            "attributes.socials.facebook": obj.facebook,
            "attributes.socials.instagram": obj.instagram,
            "attributes.socials.linkedin": obj.linkedin,
            "attributes.socials.pinterest": obj.pinterest,
            "attributes.socials.telegram": obj.telegram,
            "attributes.socials.twitter": obj.twitter,
            "attributes.socials.youtube": obj.youtube,
            "linked.mapycz": obj.mapycz,
            "linked.geonames": obj.geonames
          },
          $addToSet: {
            "keywords": { $each: obj.keywords }
          }
        }
      };

      await writeUpdateToDatabase(client, lst, upd);
      reportUpdatedItems(cnt, TOT, resource);

      payload = payload.slice(WINDOW);
    }

    reportFinished(resource, cnt);
  }
  catch (ex) { reportError(ex); }
  finally { await client.close(); }
}

wikidataEnrich();
