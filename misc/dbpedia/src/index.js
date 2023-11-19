import axios from "axios";

// string
// const DBPEDIA_ACCEPT_CONTENT = "text/turtle";

// compacted json-ld object
// const DBPEDIA_ACCEPT_CONTENT = "application/ld+json";

// string
const DBPEDIA_ACCEPT_CONTENT = "application/n-triples";

// error!
// const DBPEDIA_ACCEPT_CONTENT = "application/n-quads";

const DBPEDIA_SPARQL_ENDPOINT = "https://dbpedia.org/sparql?query=";

const dbpediaQuery = () => `PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX my: <http://example.com/>
CONSTRUCT {
  ?id my:name ?label.
}
WHERE {
  ?id rdfs:label ?label.
}
LIMIT 10`;

async function main() {
  const response = await axios.get(DBPEDIA_SPARQL_ENDPOINT + encodeURIComponent(dbpediaQuery()), {
    headers: {
      Accept: `${DBPEDIA_ACCEPT_CONTENT}; charset=utf-8`,
      "User-Agent": "SmartWalk (https://github.com/zhukovdm/smartwalk)"
    }
  });
  console.log(response.data);
  console.log(typeof response.data);
}

main();
