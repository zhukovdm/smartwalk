import { ValueItem } from "./types";
import { Reporter } from "./reporter";
import fetch from "./fetch";
import writeToFile from "./write";

/** Extracted value should occur at least `COUNT_LIMIT` times. */
const COUNT_LIMIT = 50;

/** Extract first number of pages. */
const COUNT_PAGES = 5;

/** Extracted value should have lehgth at least `MIN` chars. */
const KEYWORD_LENGTH_LIMIT_MIN = 3;

/** Extracted value should have lehgth at most `MAX` chars. */
const KEYWORD_LENGTH_LIMIT_MAX = 30;

/**
 * All extracted keywords should comply with the snake_case-without-underscores
 * pattern (e.g. "medieval_art" ~> "medieval art")
 */
const KEYWORD_PATTERN = /^[a-z]+(?:[ ][a-z]+)*$/;

function isValidKeyword(keyword: string) {
  return KEYWORD_PATTERN.test(keyword)
    && keyword.length >= KEYWORD_LENGTH_LIMIT_MIN
    && keyword.length <= KEYWORD_LENGTH_LIMIT_MAX
};

const FORBIDDEN_VALUES = new Set<string>([
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
 * Extract valid values.
 */
function reducer(acc: Map<string, number>, item: ValueItem) {

  item.value
    .split(/[\s;,]+/)
    .map((value) => value.toLowerCase().replace('_', ' '))
    .filter((value) => isValidKeyword(value) && !FORBIDDEN_VALUES.has(value))
    .forEach((value) => {
      if (!acc.has(value)) { acc.set(value, 0); }
      acc.set(value, acc.get(value)! + item.count);
    });

  return acc;
}

/**
 * Prepare for write to file. Note that Map does not maintain
 * lexicographic order!
 */
function transform(map: Map<string, number>): ValueItem[] {
  return Array.from(map.keys())
    .map((key) => ({ value: key, count: map.get(key)! }))
    .sort((l, r) => r.count - l.count)
    .filter(pair => pair.count >= COUNT_LIMIT);
}

/**
 * Get possible values of the most popular tags with their frequencies.
 * 
 * https://taginfo.openstreetmap.org/taginfo/apidoc#api_4_key_values
 */
async function get(keys: string[]) {
  const reporter = new Reporter();

  try {
    reporter.reportKeys(keys);

    for (const key of keys) {

      reporter.reportKeyProcessing(key);
      const result = new Map<string, number>();

      for (let page = 1; page <= COUNT_PAGES; ++page) {
        reporter.reportPageProcessing(page);

        (await fetch(key, page, reporter)).data
          .reduce((acc, item) => (reducer(acc, item)), result);
      }

      const list = transform(result);
      writeToFile(key, list);
      reporter.reportFinishedKey(key, list.length);
    }
    reporter.reportFinished();
  }
  catch (ex) { reporter.reportError(ex); }
}

get(process.argv.slice(2));
