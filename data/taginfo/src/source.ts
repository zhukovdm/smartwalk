import axios from "axios";
import {
  SafeFetcher,
  isValidKeyword
} from "../../shared/dist/src/index.js";
import type {
  ValueItem,
  ValueObject
} from "./types.js";
import Logger from "./logger.js";

/** Extract first number of pages. */
const COUNT_PAGES = 5;

/** Keywords skipped from the collection. */
const FORBIDDEN_KEYWORDS = new Set<string>([
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
 * Construct target url.
 */
function getTaginfoQuery(key: string, page: number): string {
  return `https://taginfo.openstreetmap.org/api/4/key/values?key=${key}&page=${page}&rp=100&filter=all&lang=en&sortname=count&sortorder=desc&qtype=value&format=json`;
};

/**
 * Extract valid values and filter out invalid ones.
 */
function reduce(col: Map<string, number>, itm: ValueItem) {
  return itm.value
    .split(/[\s;,]+/)
    .map((value) => value.toLowerCase().replace('_', ' '))
    .filter((value) => isValidKeyword(value) && !FORBIDDEN_KEYWORDS.has(value))
    .reduce((acc, value) => {
      if (!acc.has(value)) { acc.set(value, 0); }
      return acc.set(value, acc.get(value)! + itm.count);
    }, col);
}

export default class Source {
  readonly logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  async load(key: string): Promise<Map<string, number>> {
    const result = new Map<string, number>();

    for (let page = 1; page <= COUNT_PAGES; ++page) {
      this.logger.logPageProcessing(page);

      const obj = await new SafeFetcher<ValueObject>(3, 1, 10)
        .fetchWithRetry(
          async () => (await axios.get(getTaginfoQuery(key, page))).data,
          (attempt: number, err: unknown) => {
            this.logger.logFailedFetchAttempt(key, page, attempt, err);
          },
          { data: [] }
        );

      obj.data.reduce(reduce, result);
    }

    return result;
  }
}
