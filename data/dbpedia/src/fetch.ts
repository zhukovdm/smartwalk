import axios from "axios";
import jsonld, { type ContextDefinition } from "jsonld";
import Logger from "./logger";

const DBPEDIA_ACCEPT_CONTENT = "application/n-triples";
const DBPEDIA_RDF_FORMAT = "application/n-quads";

const DBPEDIA_SPARQL_ENDPOINT = "https://dbpedia.org/sparql?query=";

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
} as ContextDefinition;

const dbpediaQuery = (payload: string[]) => `PREFIX dbo: <http://dbpedia.org/ontology/>
PREFIX dbp: <http://dbpedia.org/property/>
PREFIX dbr: <http://dbpedia.org/resource/>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX my: <http://example.com/>
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
VALUES ?wikidataId { ${payload.join(" ")} }
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

async function fetchFromDbPedia(query: string) {

  const res = await axios.get(DBPEDIA_SPARQL_ENDPOINT + encodeURIComponent(query), {
    headers: {
      Accept: `${DBPEDIA_ACCEPT_CONTENT}; charset=utf-8`,
      "User-Agent": "SmartWalk (https://github.com/zhukovdm/smartwalk)"
    }
  });

  // empty graph
  if ((res.data as string).startsWith("# Empty NT")) {
    return [];
  }

  const arr = await jsonld.fromRDF(res.data, {
    format: DBPEDIA_RDF_FORMAT // look at n-triples as if it were n-quads!
  });

  const jsn = await jsonld.compact(arr, DBPEDIA_JSONLD_CONTEXT);
  return jsn["@graph"] ?? [];
}

const getFirst = (obj: unknown) => (Array.isArray(obj) ? obj[0] : obj);

function handleDate(value: string) {
  const d = new Date(value).getFullYear();
  return isNaN(d) ? undefined : d;
}

function constructFromEntity(entity: any): any {
  const object = {} as any;

  // en-containers
  object.name = getFirst(entity.name?.en);
  object.description = getFirst(entity.description?.en);

  // lists
  object.image = getFirst(entity.image);
  object.website = getFirst(entity.website);

  // dates
  object.year = handleDate(getFirst(entity.date));

  // linked
  object.dbpedia = (getFirst(entity.dbpedia))?.substring(3);
  object.yago = (getFirst(entity.yago))?.substring(3);

  // existing
  object.wikidata = entity.wikidata.substring(3);

  return object;
}

const wait = (seconds: number): Promise<void> => (
  new Promise((resolve) => setTimeout(resolve, seconds * 1000.0)));

export async function fetch(logger: Logger, items: string[]) {
  let result: any[] | undefined = undefined;

  let attempt = 0;
  const query = dbpediaQuery(items);
  await wait(3);

  do {
    ++attempt;
    try {
      result = ((await fetchFromDbPedia(query)) as any[])
        .map((entity: any) => constructFromEntity(entity));
    }
    catch (ex) {
      logger.logFailedFetchAttempt(attempt, ex);
      await wait(10);
    }
  } while (result === undefined && attempt < 3);

  result ??= [];
  logger.logFetchedEntities(result.length, items.length);

  return result;
}
