import axios from "axios";

// string
// const WIKIDATA_ACCEPT_CONTENT = "text/turtle";

// expanded json-ld object
// const WIKIDATA_ACCEPT_CONTENT = "application/ld+json";

// string
const WIKIDATA_ACCEPT_CONTENT = "application/n-triples";

// string
// const WIKIDATA_ACCEPT_CONTENT = "application/n-quads";

const WIKIDATA_SPARQL_ENDPOINT = "https://query.wikidata.org/sparql?query=";

const wikidataQuery = () => `PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX my: <http://example.com/>
CONSTRUCT {
  ?id my:name ?label.
}
WHERE {
  ?id rdfs:label ?label.
}
LIMIT 10`;

export default async function wikidata() {
  const response = await axios.get(WIKIDATA_SPARQL_ENDPOINT + encodeURIComponent(wikidataQuery()), {
    headers: {
      "Accept": `${WIKIDATA_ACCEPT_CONTENT}; charset=utf-8`,
      "User-Agent": "SmartWalk (https://github.com/zhukovdm/smartwalk)"
    }
  });
  console.log("\nWikidata\n");
  console.log(response.data);
  console.log(`Type of response data: ${typeof response.data}.`);
}
