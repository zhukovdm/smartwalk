import consola from "consola";
import {
  dropKeywordCollection,
  getClient,
  getKeywordCollection,
  getPlaceCollection
} from "./shared.cjs";

/**
 * Extract keywords with attributes.
 * @param {*} doc document that is currently considered.
 * @param {*} keywords map for keeping extracted keyword counts.
 */
function extract(doc, keywords) {

  const base = (word) => ({
    keyword: word,
    count: 0,
    attributeList: new Set().add("name"),
    bounds: {}
  });

  doc.keywords.forEach((word) => {

    if (!keywords.has(word)) {
      keywords.set(word, base(word));
    }

    const obj = keywords.get(word);
    const bnd = obj.bounds;

    // count

    ++obj.count;

    // attributes

    Object.keys(doc.attributes)
      .forEach((key) => obj.attributeList.add(key));

    // numerics

    ["capacity", "elevation", "minimumAge", "rating", "year"].forEach((item) => {
      const num = doc.attributes[item];

      if (num !== undefined) {
        bnd[item] = bnd[item] ?? { min: Number.MAX_VALUE, max: Number.MIN_VALUE };
        bnd[item].min = Math.min(bnd[item].min, num);
        bnd[item].max = Math.max(bnd[item].max, num);
      }
    });

    // collections

    ["clothes", "cuisine", "denomination", "payment", "rental"].forEach((item) => {
      const col = doc.attributes[item];

      if (col !== undefined) {
        bnd[item] = bnd[item] ?? new Set();
        col.forEach((atom) => { bnd[item].add(atom); })
      }
    });
  });
}

/**
 * Main function performing index construction.
 */
async function advice() {

  const logger = consola.create();
  const client = getClient();

  try {
    await dropKeywordCollection(client);
  } catch (ex) { logger.error(`Keyword collection: ${ex?.message}`); }

  const keywdColl = getKeywordCollection(client);
  const placeColl = getPlaceCollection(client);

  let cnt = 0, tot = 0;

  try {
    const keywords = new Map();

    logger.info(`Collecting information about stored documents.`);
    let gc = placeColl.find();

    // extract

    while (await gc.hasNext()) {
      extract(await gc.next(), keywords);

      if (++cnt >= 1000) {
        tot += cnt; cnt = 0;
        logger.info(`Still working... Processed ${tot} documents.`);
      }
    }

    logger.info(`Processed ${tot + cnt} documents, completing advice...`);

    await gc.close();

    // insert

    const set2arr = (set) => set ? [...set].sort() : undefined;

    for (const keyword of keywords.values()) {
      const bnd = keyword.bounds;

      await keywdColl.insertOne({
        ...keyword,
        attributeList: set2arr(keyword.attributeList /* non-empty */),
        bounds: {
          ...keyword.bounds,
          clothes: set2arr(bnd.clotnes),
          cuisine: set2arr(bnd.cuisine),
          denomination: set2arr(bnd.denomination),
          payment: set2arr(bnd.payment),
          rental: set2arr(bnd.rental)
        }
      }, {
        ignoreUndefined: true
      });
    };

    logger.info(`Advice has been completed.`);
  }
  catch (ex) { logger.error(ex); }
  finally {
    await client.close();
  }
}

advice();
