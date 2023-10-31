import axios from "axios";
import jsonld from "jsonld";
import Logger from "./logger";

const LOCATION_PRECISION = 7;

const roundCoordinate = (num: number): number => (
  parseFloat(num.toFixed(LOCATION_PRECISION)));

const WIKIDATA_ACCEPT_CONTENT = "application/n-quads";
const WIKIDATA_SPARQL_ENDPOINT = "https://query.wikidata.org/sparql?query=";

const WIKIDATA_JSONLD_CONTEXT = {
  "my": "http://example.com/",
  "wd": "http://www.wikidata.org/entity/",
  "geo": "http://www.opengis.net/ont/geosparql#",
  "xsd": "http://www.w3.org/2001/XMLSchema#",
  "location": {
    "@id": "my:location",
    "@type": "geo:wktLiteral"
  },
  "osmN": {
    "@id": "my:osmN",
  },
  "osmW": {
    "@id": "my:osmW",
  },
  "osmR": {
    "@id": "my:osmR",
  },
  "wikidata": "@id"
};

/**
 * - 
 * - https://www.wikidata.org/wiki/Property:P11693
 * - https://www.wikidata.org/wiki/Property:P10689
 * - https://www.wikidata.org/wiki/Property:P402
 * 
 * @param bbox Bounding box
 * @returns query as a string
 */
const wikidataQuery = ({ w, n, e, s }: Bbox) => (`PREFIX bd: <http://www.bigdata.com/rdf#>
PREFIX geo: <http://www.opengis.net/ont/geosparql#>
PREFIX my: <http://example.com/>
PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX wikibase: <http://wikiba.se/ontology#>
CONSTRUCT {
  ?wikidataId
    my:location ?location;
    my:osmN ?osmN;
    my:osmW ?osmW;
    my:osmR ?osmR.
}
WHERE {
  SERVICE wikibase:box {
    ?wikidataId wdt:P625 ?location.
    bd:serviceParam wikibase:cornerSouthWest "Point(${w} ${s})"^^geo:wktLiteral.
    bd:serviceParam wikibase:cornerNorthEast "Point(${e} ${n})"^^geo:wktLiteral.
  }
  OPTIONAL {
    ?wikidataId wdt:P11693 ?osmN.
  }
  OPTIONAL {
    ?wikidataId wdt:P10689 ?osmW.
  }
  OPTIONAL {
    ?wikidataId wdt:P402 ?osmR.
  }
}`);

/**
 * @param query SPARQL query compliant with Wikidata KG.
 * @returns Graph represented as a list of entities.
 */
async function fetchFromWikidata(query: string) {

  const res = await axios.get(WIKIDATA_SPARQL_ENDPOINT + encodeURIComponent(query), {
    headers: {
      Accept: `${WIKIDATA_ACCEPT_CONTENT}; charset=utf-8`,
      "User-Agent": "SmartWalk (https://github.com/zhukovdm/smartwalk)"
    }
  });
  const arr = await jsonld.fromRDF(res.data, { format: WIKIDATA_ACCEPT_CONTENT });
  const jsn = await jsonld.compact(arr, WIKIDATA_JSONLD_CONTEXT);
  return jsn["@graph"] ?? [];
}

const getFirst = (obj: unknown) => (Array.isArray(obj) ? obj[0] : obj);

/**
 * Extract longitude and latitude from WKT literal.
 * @param location WKT point `Point(lon lat)`
 */
function extractLocation(location: string): WgsPoint {
  const re = /^Point\((?<lon>-?\d+(\.\d+)?) (?<lat>-?\d+(\.\d+)?)\)$/i;
  const { lon, lat } = re.exec(location)!.groups!;
  return {
    lon: roundCoordinate(parseFloat(lon!)),
    lat: roundCoordinate(parseFloat(lat!))
  };
}

function extractOsmId(n?: string, w?: string, r?: string): string | undefined {
  const f = (prefix: string, id?: string) => (!!id) ? `${prefix}/${id}` : undefined;
  return f("node", n) ?? f("way", w) ?? f("relation", r);
}

const constructFromEntity = (entity: any): Item => ({
  location: extractLocation(getFirst(entity.location)),
  osm: extractOsmId(getFirst(entity.osmN), getFirst(entity.osmW), getFirst(entity.osmR)),
  wikidata: entity.wikidata.substring(3) as string // cut off `wd:`
});

function wait(seconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000.0))
}

async function fetchSquare(logger: Logger, bbox: Bbox): Promise<Item[]> {
  let result: Item[] | undefined = undefined;
  logger.logSquare(bbox);

  let attempt = 0;
  const query = wikidataQuery(bbox);
  await wait(3);

  do {
    ++attempt;
    try {
      result = ((await fetchFromWikidata(query)) as any)
        .map((entity: any) => constructFromEntity(entity));
    }
    catch (ex) {
      logger.logFailedFetchAttempt(attempt, ex);
      await wait(10);
    }
  } while (result === undefined && attempt < 3);

  return result ?? [];
}

export async function fetchBbox(logger: Logger, bbox: Bbox, rows: number, cols: number): Promise<Item[]> {

  const result = new Map<string, Item>();
  const {
    w: xW,
    n: xN,
    e: xE,
    s: xS
  } = bbox;
  const rowStep = (xN - xS) / rows;
  const colStep = (xE - xW) / cols;
  
  for (let row = 0; row < rows; ++row) {
    for (let col = 0; col < cols; ++col) {

      const s = roundCoordinate(xS + rowStep * row);
      const n = roundCoordinate(s + rowStep);

      const w = roundCoordinate(xW + colStep * col);
      const e = roundCoordinate(w + colStep);

      (await fetchSquare(logger, { w: w, n: n, e: e, s: s })).forEach((item) => {
        result.set(item.wikidata, item);
      });
    }
  }

  logger.logFetchedEntities(result.size);
  return Array.from(result.values());
}
