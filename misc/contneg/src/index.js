import dbpedia from "./dbpedia.js";
import wikidata from "./wikidata.js";

async function main() {
  await dbpedia();
  await wikidata();
}

main();
