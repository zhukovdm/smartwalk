import fs from "fs";
import consola from "consola";
import fetch from "node-fetch";
import {
  ASSETS_BASE_ADDR,
  convertSnakeToKeyword,
  isValidKeyword
} from "./shared.cjs";

/**
 * Extracted value should occur at least `COUNT_LIMIT` times.
 */
const COUNT_LIMIT = 50;

/**
 * Extract first number of pages.
 */
const COUNT_PAGES = 5;

/**
 * Form valid query.
 */
const query = (key, page) => {
  return `https://taginfo.openstreetmap.org/api/4/key/values?key=${key}&page=${page}&rp=100&filter=all&lang=en&sortname=count&sortorder=desc&qtype=value&format=json`;
};

const FORBIDDEN_VALUES = new Set([
  "abandoned",
  "and",
  "antenna",
  "apron",
  "attached",
  "bare rock",
  "barrack",
  "bay",
  "building",
  "buildings",
  "cape",
  "case",
  "clearway",
  "cliff",
  "coastline",
  "colapsed",
  "collapsed",
  "construction",
  "damaged",
  "demolished",
  "destroyed",
  "detached",
  "detached house",
  "disused",
  "empty",
  "exit",
  "fixme",
  "fuel",
  "garage",
  "general",
  "glacier",
  "grassland",
  "hangar",
  "heath",
  "helipad",
  "holding position",
  "home",
  "house",
  "incomplete",
  "jet bridge",
  "mast",
  "maybe",
  "mean low water springs",
  "mixed use",
  "mixed used",
  "motorcycle parking",
  "mud",
  "no",
  "occupied",
  "obstacle",
  "outbuilding",
  "parking",
  "parking entrance",
  "parking exit",
  "parking position",
  "parking space",
  "part",
  "place",
  "platform",
  "prefabricated",
  "preserved",
  "proposed",
  "razed",
  "recycling",
  "residential",
  "ridge",
  "rock",
  "rooms",
  "runway",
  "saddle",
  "sand",
  "scree",
  "scrub",
  "semi",
  "semidetached",
  "semidetached house",
  "service",
  "shingle",
  "shops",
  "shrub",
  "silo",
  "sinkhole",
  "small",
  "stop area",
  "stop position",
  "survey point",
  "taxilane",
  "taxiway",
  "transportation",
  "tree",
  "tree row",
  "unclassified",
  "undefined",
  "unit",
  "units",
  "unknown",
  "utility pole",
  "ventilation shaft",
  "waste basket",
  "water",
  "wetland",
  "windsock",
  "wood",
  "yes",
  "yesq",
]);

/**
 * Extracts possible values of the most popular tags with their frequencies.
 * 
 * https://taginfo.openstreetmap.org/taginfo/apidoc#api_4_key_values
 */
async function extract(args) {

  const logger = consola.create();

  try {
    logger.info(`Started processing OSM tags ${args.join(", ")}.`);

    for (const key of args) {

      logger.info(`> Processing key ${key}.`);
      const dict = new Map();

      for (let page = 1; page <= COUNT_PAGES; ++page) {
        logger.info(`>  Processing page ${page}.`);
        const res = await fetch(query(key, page));
        const jsn = await res.json();
        jsn.data.forEach((item) => {
          // extract only valid values
          item.value
            .split(/[\s;,]+/)
            .map((value) => convertSnakeToKeyword(value))
            .filter((value) => isValidKeyword(value) && !FORBIDDEN_VALUES.has(value))
            .forEach((value) => {
              if (!dict.has(value)) { dict.set(value, 0); }
              dict.set(value, dict.get(value) + item.count);
            });
        });
      }

      const file = `${ASSETS_BASE_ADDR}/tags/${key}.json`;

      // Map does not maintain lexicographic order!
      let obj = [...dict.keys()]
        .map(key => { return { value: key, count: dict.get(key) }; })
        .sort((l, r) => r.count - l.count)
        .filter(pair => pair.count >= COUNT_LIMIT);

      // write to a file
      fs.writeFileSync(file, JSON.stringify(obj, null, 2));

      logger.info(`> Finished processing file ${file}, extracted ${obj.length} objects.`);
    }
    logger.info("Finished processing OSM tags.");
  }
  catch (ex) { logger.error(ex); }
}

extract(process.argv.slice(2));
