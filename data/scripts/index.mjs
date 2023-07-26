import consola from "consola";
import { MongoClient } from "mongodb";
import {
  getGrainCollection,
  getIndexCollection,
  MONGO_CONNECTION_STRING,
  MONGO_DATABASE,
  MONGO_GRAIN_COLLECTION,
  MONGO_INDEX_COLLECTION
} from "./shared.cjs";

/**
 * Extract keywords with attributes.
 * @param {*} doc document that is currently considered.
 * @param {*} keywords map for keeping extracted keyword counts.
 */
function extractKeywords(doc, keywords) {

  const base = (word) => { return { label: word, count: 0, attributeList: new Set() }; };

  doc.keywords.forEach(word => {
    if (!keywords.has(word)) { keywords.set(word, base(word)); }
    const item = keywords.get(word);

    ++item.count;
    Object.keys(doc.attributes).forEach(key => item.attributeList.add(key));
  });
}

/**
 * Extract values that can appear in `cuisine`, `clothes`, or `rental`
 * collections.
 * @param {*} doc document that is currently considered.
 * @param {*} collect objects storing values.
 * @param {*} func appender for a possible new value.
 */
function extractCollects(doc, collect, func) {

  const base = (word) => { return { label: word, count: 0 }; };

  func(doc)?.forEach(word => {
    if (!collect.has(word)) { collect.set(word, base(word)); }
    ++collect.get(word).count;
  });
}

/**
 * Extract limits of the numeric attributes, such as `rating`, `capacity`,
 * and `minimumAge`.
 * @param {*} doc document that is currently considered.
 * @param {*} numeric objects storing limits.
 * @param {*} func setter for a possible new value.
 */
function extractNumerics(doc, numeric, func) {
  const val = func(doc);

  if (val) {
    numeric.min = Math.min(numeric.min, val);
    numeric.max = Math.max(numeric.max, val);
  }
}

/**
 * Main function performing index construction to improve user interaction
 * with the system. In particular, to ensure responsive autocomplete.
 */
async function index() {

  const logger = consola.create();

  const client = new MongoClient(MONGO_CONNECTION_STRING);

  try {
    await client.db(MONGO_DATABASE).dropCollection(MONGO_INDEX_COLLECTION, {  });
  } catch (ex) { logger.error(ex.message); }

  const grain = getGrainCollection(client, MONGO_GRAIN_COLLECTION);
  const index = getIndexCollection(client, MONGO_INDEX_COLLECTION);

  let cnt = 0, tot = 0;

  const arr = (n) => Array.apply(null, Array(n));

  try {
    const [keywords, clothes, cuisine, rental] = arr(4).map(() => new Map());
    const [year, rating, capacity, elevation, minimumAge] = arr(5).map(() => {
      return { min: Number.MAX_SAFE_INTEGER, max: Number.MIN_SAFE_INTEGER };
    });

    let gc = grain.find();

    while (await gc.hasNext()) {

      let doc = await gc.next();

      extractKeywords(doc, keywords);

      extractCollects(doc, rental, (doc) => doc.attributes.rental);
      extractCollects(doc, clothes, (doc) => doc.attributes.clothes);
      extractCollects(doc, cuisine, (doc) => doc.attributes.cuisine);

      extractNumerics(doc, year, (doc) => doc.attributes.year);
      extractNumerics(doc, rating, (doc) => doc.attributes.rating);
      extractNumerics(doc, capacity, (doc) => doc.attributes.capacity);
      extractNumerics(doc, elevation, (doc) => doc.attributes.elevation);
      extractNumerics(doc, minimumAge, (doc) => doc.attributes.minimumAge);

      if (++cnt >= 1000) { tot += cnt; cnt = 0; logger.info(`Still working... Processed ${tot} documents.`); }
    }

    logger.info(`Processed ${tot + cnt} documents, constructing index...`);

    await gc.close();

    // insert keywords

    await index.insertOne({
      _id: "keywords",
      keywords: [...keywords.keys()].map(key => {
        const item = keywords.get(key);
        return { ...item, attributeList: [...item.attributeList] }; // attribute items as a list!
      })
    });

    capacity.max = 1000; // (!)

    // insert bounds

    const map2arr = (m) => [...m.keys()].map(key => m.get(key));

    await index.insertOne({
      _id: "bounds",
      bounds: {
        rental: map2arr(rental),
        clothes: map2arr(clothes),
        cuisine: map2arr(cuisine),
        year: year,
        rating: rating,
        capacity: capacity,
        elevation: elevation,
        minimumAge: minimumAge
      }
    });

    logger.info(`Index has been constructed. Exiting...`);
  }
  catch (ex) { logger.error(ex); }
  finally { await client.close(); }
}

index();
