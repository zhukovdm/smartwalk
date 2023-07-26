const MongoClient = require("mongodb").MongoClient;
const jsonld = require("jsonld");
const Streamify = require("streamify-string");
const rdfParser = require("rdf-parse").default;
const rdfSerializer = require("rdf-serialize").default;
const stringifyStream = require("stream-to-string");
const {
  getPayload,
  MONGO_CONNECTION_STRING,
  reportPayload,
  reportFetchedItems,
  reportFinished,
  reportError,
  writeUpdateToDatabase
} = require("./shared.cjs");

const DBPEDIA_JSONLD_CONTEXT = {
  "my": "http://example.com/",
  "db": "http://dbpedia.org/resource/",
  "wd": "http://www.wikidata.org/entity/",
  "ya": "http://yago-knowledge.org/resource/",
  "xsd": "http://www.w3.org/2001/XMLSchema#",
  "name": {
    "@id": "my:name",
    "@container": "@language"
  },
  "description": {
    "@id": "my:description",
    "@container": "@language"
  },
  "image": {
    "@id": "my:image",
    "@type": "@id"
  },
  "website": {
    "@id": "my:website",
    "@type": "@id"
  },
  "date": {
    "@id": "my:date",
    "@type": "xsd:date"
  },
  "dbpedia": {
    "@id": "my:dbPedia",
    "@type": "@id"
  },
  "yago": {
    "@id": "my:yago",
    "@type": "@id"
  },
  "wikidata": "@id"
};

const DBPEDIA_ACCEPT_CONTENT = "text/turtle";

const DBPEDIA_SPARQL_ENDPOINT = "https://dbpedia.org/sparql";

const NQUADS_ACCEPT_CONTENT = "application/n-quads";

const dbpediaQuery = (payload) => `
PREFIX my: <http://example.com/>
PREFIX dbo: <http://dbpedia.org/ontology/>
PREFIX dbp: <http://dbpedia.org/property/>
PREFIX dbr: <http://dbpedia.org/resource/>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX schema: <http://schema.org/>
PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX yago: <http://yago-knowledge.org/resource/>
CONSTRUCT {
  ?wikidataId
    my:dbPedia ?dbPediaId;
    my:yago ?yagoId;
    my:name ?name;
    my:description ?description;
    my:image ?image;
    my:website ?website;
    my:date ?date.
}
WHERE {
VALUES ?wikidataId { ${payload} }
?dbPediaId owl:sameAs ?wikidataId .
OPTIONAL {
  ?dbPediaId rdfs:label | foaf:name | dbp:officialName | skos:prefLabel | skos:altLabel ?name .
  FILTER(LANG(?name) = "en" && STRLEN(STR(?name)) > 0)
}
OPTIONAL {
  ?dbPediaId rdfs:comment ?description .
  FILTER(LANG(?description) = "en" && STRLEN(STR(?description)) > 0)
}
OPTIONAL {
  ?dbPediaId owl:sameAs ?yagoId .
  FILTER(STRSTARTS(STR(?yagoId), "http://yago-knowledge.org/resource/"))
}
OPTIONAL {
  ?dbPediaId dbo:thumbnail ?image .
}
OPTIONAL {
  ?dbPediaId foaf:homepage ?website .
}
OPTIONAL {
  ?dbPediaId dbo:foundingDate | dbp:established | dbo:openingDate | dbp:opening | dbp:completionDate ?date.
}}`;

function handleDate(value) {
  const d = new Date(value).getFullYear();
  return isNaN(d) ? undefined : d;
}

function fetchFromDbpedia(payload) {

  return fetch(DBPEDIA_SPARQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Accept": DBPEDIA_ACCEPT_CONTENT + "; charset=utf-8",
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "GrainPath (https://github.com/grainpath)" },
    body: "query=" + encodeURIComponent(dbpediaQuery(payload))
  })
  .then((res) => res.text())
  .then((txt) => rdfParser.parse(Streamify(txt), { contentType: DBPEDIA_ACCEPT_CONTENT }))
  .then((str) => rdfSerializer.serialize(str, { contentType: NQUADS_ACCEPT_CONTENT }))
  .then((str) => stringifyStream(str))
  .then((txt) => jsonld.fromRDF(txt, { format: NQUADS_ACCEPT_CONTENT }))
  .then((doc) => jsonld.compact(doc, DBPEDIA_JSONLD_CONTEXT));
}

function constructFromJson(json) {

  const g = json["@graph"];

  if (g === undefined) { return []; }

  return g.map((ent) => {
    const obj = {};
    const fst = (a) => Array.isArray(a) ? a[0] : a;

    // en-containers
    obj.name = fst(ent.name?.en);
    obj.description = fst(ent.description?.en);

    // lists
    obj.image = fst(ent.image);
    obj.website = fst(ent.website);

    // dates
    obj.year = handleDate(fst(ent.date));

    // linked
    obj.dbpedia = (fst(ent.dbpedia))?.substring(3);
    obj.yago = (fst(ent.yago))?.substring(3);

    // existing
    obj.wikidata = ent.wikidata.substring(3);

    return obj;
  });
}

async function dbpedia() {

  let cnt = 0;
  const resource = "DbPedia";
  const client = new MongoClient(MONGO_CONNECTION_STRING);

  try {
    let payload = await getPayload(client);
    reportPayload(payload, resource);

    while (payload.length) {

      const window = 100;

      const lst = await fetchFromDbpedia(payload.slice(0, window).join(' '))
        .then((jsn) => constructFromJson(jsn));

      cnt += lst.length;
      reportFetchedItems(lst, resource);

      const upd = (obj) => {
        return {
          $set: {
            "name": obj.name,
            "attributes.name": obj.name,
            "attributes.description": obj.description,
            "attributes.image": obj.image,
            "attributes.website": obj.website,
            "attributes.year": obj.year,
            "linked.dbpedia": obj.dbpedia,
            "linked.yago": obj.yago
          }
        };
      };

      await writeUpdateToDatabase(client, lst, upd);
      payload = payload.slice(window);
    }

    reportFinished(resource, cnt);
  }
  catch (ex) { reportError(ex); }
  finally { await client.close(); }
}

dbpedia();
