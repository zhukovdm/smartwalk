import { Command } from "commander";
import { MongoClient } from "mongodb";
import {
  getGrainCollection,
  MONGO_CONNECTION_STRING,
  reportError,
  reportFetchedItems,
  reportFinished,
  reportCategory,
  reportCreatedItems,
  writeCreateToDatabase
} from "./shared.cjs";
import {
  fetchListFromWikidata
} from "./wikidata.mjs";

const cs = [
  ["Q41176", 10000], // building
  ["Q43229", 2000], // organization
  ["Q57821", 1000], // fortification
  ["Q210272", 4000], // cultural heritage
  ["Q386724", 10000], // work
  ["Q811979", 14000], // architectural structure
  ["Q960648", 1000], // point of interest
  ["Q10855061", 4000], // archaeological find
  ["Q17537576", 5000], // creative work
  ["Q110910970", 5000], // visual work
];

/**
 * @param {*} cat Wikidata identifier defining category of objects.
 * @param {*} lim Maximum number of requested objects.
 * @param {*} ws West-South coordinate.
 * @param {*} en East-North coordinate.
 * @returns Query as a string.
 */
const wikidataQuery = (cat, lim, ws, en) => `PREFIX bd: <http://www.bigdata.com/rdf#>
PREFIX geo: <http://www.opengis.net/ont/geosparql#>
PREFIX my: <http://example.com/>
PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX wikibase: <http://wikiba.se/ontology#>
CONSTRUCT {
  ?wikidataId my:location ?location.
}
WHERE {
  ?wikidataId wdt:P31/wdt:P279* wd:${cat}.
  SERVICE wikibase:box {
    ?wikidataId wdt:P625 ?location.
    bd:serviceParam wikibase:cornerSouthWest "Point(${ws})"^^geo:wktLiteral.
    bd:serviceParam wikibase:cornerNorthEast "Point(${en})"^^geo:wktLiteral.
  }
}
LIMIT ${lim}`;

/**
 * Define Wikidata categories, south-west, and north-east points.
 */
const args = new Command()
  .option("--w [number]")
  .option("--n [number]")
  .option("--e [number]")
  .option("--s [number]");

function concat(a, b) { return [a, b].join(' '); }

/**
 * Extract longitude and latitude from WKT literal.
 * @param {*} location WKT point `POINT(lon, lat)`
 */
function extractLocation(location) {

  const re = /POINT\((?<lon>-?\d+\.\d+) (?<lat>-?\d+\.\d+)\)/i;
  const { groups: { lon, lat } } = re.exec(location);
  return { lon: Number(lon), lat: Number(lat) };
}

function constructFromEntity(ent) {
  return {
    location: extractLocation(ent.location),
    wikidata: ent.wikidata.substring(3) // cut wd:
  };
}

/**
 * Create entities that exist in the Wikidata unknown to the database.
 */
async function wikidataCreate() {

  const resource = "Wikidata";
  const { w, n, e, s } = args.parse().opts();

  const client = new MongoClient(MONGO_CONNECTION_STRING)

  try {
    let tot = 0;

    for (const [cat, lim] of cs) {
      let cnt = 0;
      reportCategory(cat);

      const qry = wikidataQuery(cat, lim, concat(w, s), concat(e, n));
      const lst = await fetchListFromWikidata(qry)
        .then((lst) => lst.map((e) => constructFromEntity(e)));

      reportFetchedItems(lst, resource);

      for (const obj of lst) {

        if (!await getGrainCollection(client).findOne({ "linked.wikidata": obj.wikidata })) {
          ++cnt;
          const loc = obj.location;

          const ins = {
            name: "Noname",
            keywords: [],
            location: loc,
            position: {
              type: "Point",
              coordinates: [loc.lon, loc.lat]
            },
            attributes: {
              name: "Noname",
            },
            linked: {
              wikidata: obj.wikidata
            }
          };

          await writeCreateToDatabase(client, ins);
        }
      }
      tot += cnt;
      reportCreatedItems(cat, cnt, tot);
    }
    reportFinished(resource, tot);
  }
  catch (ex) { reportError(ex); }
  finally { await client.close(); }
}

wikidataCreate();
