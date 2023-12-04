import axios from "axios";
import jsonld, { type ContextDefinition } from "jsonld";
import {
  EnrichSource,
  EnrichLogger
} from "../../shared/dist/src/index.js";

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

/**
 * @param payload List of identifiers.
 * @returns Query as a string.
 */
function getDbpediaQuery(payload: string[]): string {
  return `PREFIX dbo: <http://dbpedia.org/ontology/>
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
}}`};

async function fetchFromDbPedia(query: string): Promise<any[]> {

  const res = await axios.get(DBPEDIA_SPARQL_ENDPOINT + encodeURIComponent(query), {
    headers: {
      "Accept": `${DBPEDIA_ACCEPT_CONTENT}; charset=utf-8`,
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
  return (jsn["@graph"] ?? []) as any[];
}

export default class Source extends EnrichSource<any> {

  constructor(logger: EnrichLogger) {
    super(logger);
  }

  getQuery(items: string[]): string {
    return getDbpediaQuery(items);
  }

  fetchFrom(query: string): Promise<any[]> {
    return fetchFromDbPedia(query);
  }
}
