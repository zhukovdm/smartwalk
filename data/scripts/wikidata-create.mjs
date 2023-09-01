import { Command } from "commander";
import {
  getClient,
  getFirst,
  getPlaceCollection,
  reportCategory,
  reportCreatedItems,
  reportError,
  reportFetchedItems,
  reportFinished,
  writeCreateToDatabase
} from "./shared.cjs";
import { fetchListFromWikidata } from "./wikidata.mjs";

/*******************************************************************************
 * 
 * Do not forget to set up this array based on your preferences.
 * 
 ******************************************************************************/
const cs = [
  ["Q41176",     10000], // building
  ["Q43229",     2000 ], // organization
  ["Q57821",     1000 ], // fortification
  ["Q210272",    4000 ], // cultural heritage
  ["Q386724",    10000], // work
  ["Q811979",    14000], // architectural structure
  ["Q960648",    1000 ], // point of interest
  ["Q10855061",  4000 ], // archaeological find
  ["Q17537576",  5000 ], // creative work
  ["Q110910970", 5000 ], // visual work
];

const LOCATION_PRECISION = 7;

/**
 * @param {string} cat Wikidata identifier defining category of objects.
 * @param {number} lim Maximum number of requested objects.
 * @param {number} w West coordinate.
 * @param {number} n North coordinate.
 * @param {number} e East coordinate.
 * @param {number} s South coordinate.
 * @returns Query as a string.
 */
const wikidataQuery = (cat, lim, w, n, e, s) => `PREFIX bd: <http://www.bigdata.com/rdf#>
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
    bd:serviceParam wikibase:cornerSouthWest "Point(${w} ${s})"^^geo:wktLiteral.
    bd:serviceParam wikibase:cornerNorthEast "Point(${e} ${n})"^^geo:wktLiteral.
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

/**
 * Extract longitude and latitude from WKT literal.
 * @param {string} location WKT point `Point(lon, lat)`
 */
function extractLocation(location) {

  const re = /^Point\((?<lon>-?\d+(\.\d+)?) (?<lat>-?\d+(\.\d+)?)\)$/i;
  const { groups: { lon, lat } } = re.exec(location);
  return {
    lon: parseFloat(Number(lon).toFixed(LOCATION_PRECISION)),
    lat: parseFloat(Number(lat).toFixed(LOCATION_PRECISION))
  };
}

function constructFromEntity(ent) {
  return {
    location: extractLocation(getFirst(ent.location)),
    wikidata: ent.wikidata.substring(3) // cut wd:
  };
}

/**
 * Create entities that exist in the Wikidata unknown to the database.
 */
async function wikidataCreate() {

  const resource = "Wikidata";
  const { w, n, e, s } = args.parse().opts();

  const client = getClient();

  try {
    let tot = 0;

    for (const [cat, lim] of cs) {
      let cnt = 0;
      reportCategory(cat);

      const qry = wikidataQuery(cat, lim, w, n, e, s);
      const lst = await fetchListFromWikidata(qry)
        .then((lst) => lst.map((e) => constructFromEntity(e)));

      reportFetchedItems(lst, resource);

      for (const obj of lst) {

        if (!await getPlaceCollection(client).findOne({ "linked.wikidata": obj.wikidata })) {
          ++cnt;

          const ins = {
            name: "Noname",
            keywords: [],
            location: obj.location,
            attributes: {},
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
