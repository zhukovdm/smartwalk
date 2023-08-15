import consola from "consola";
import {
  dropBoundsCollection,
  dropKeywordCollection,
  getBoundsCollection,
  getClient,
  getKeywordCollection,
  getPlaceCollection
} from "./shared.cjs";

/**
 * Extract keywords with attributes.
 * @param {*} doc document that is currently considered.
 * @param {*} keywords map for keeping extracted keyword counts.
 */
function extractKeywords(doc, keywords) {

  const base = (word) => ({ keyword: word, count: 0, attributeList: new Set() });

  doc.keywords.forEach(word => {
    if (!keywords.has(word)) { keywords.set(word, base(word)); }
    const item = keywords.get(word);

    ++item.count;
    Object.keys(doc.attributes).forEach(key => item.attributeList.add(key));
  });
}

/**
 * Extract values that can appear in collections, such as `cuisine`.
 * @param {*} doc document that is currently considered.
 * @param {*} collect objects storing values.
 * @param {*} func appender for a possible new value.
 */
function extractCollects(doc, collect, func) {

  const base = (word) => ({ label: word, count: 0 });

  func(doc)?.forEach(word => {
    if (!collect.has(word)) { collect.set(word, base(word)); }
    ++collect.get(word).count;
  });
}

/**
 * Extract limits of the numeric attributes, such as `rating`.
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
 * Main function performing index construction.
 */
async function advice() {

  const logger = consola.create();
  const client = getClient();

  try {
    await dropBoundsCollection(client);
  } catch (ex) { logger.error(`Bounds collection: ${ex?.message}`); }

  try {
    await dropKeywordCollection(client);
  } catch (ex) { logger.error(`Keyword collection: ${ex?.message}`); }

  const boundColl = getBoundsCollection(client);
  const keywdColl = getKeywordCollection(client);
  const placeColl = getPlaceCollection(client);

  let cnt = 0, tot = 0;

  const arr = (n) => Array.apply(null, Array(n));

  try {
    const [
      keywords,
      clothes,
      cuisine,
      denomination,
      payment,
      rental
    ] = arr(6).map(() => new Map());

    const [
      capacity,
      elevation,
      minimumAge,
      rating,
      year
    ] = arr(5).map(() => ({ min: Number.MAX_SAFE_INTEGER, max: Number.MIN_SAFE_INTEGER }));

    logger.info(`Collecting information about stored documents.`);
    let gc = placeColl.find();

    while (await gc.hasNext()) {
      let doc = await gc.next();

      extractKeywords(doc, keywords);

      extractNumerics(doc, capacity, (doc) => doc.attributes.capacity);
      extractNumerics(doc, elevation, (doc) => doc.attributes.elevation);
      extractNumerics(doc, minimumAge, (doc) => doc.attributes.minimumAge);
      extractNumerics(doc, rating, (doc) => doc.attributes.rating);
      extractNumerics(doc, year, (doc) => doc.attributes.year);

      extractCollects(doc, clothes, (doc) => doc.attributes.clothes);
      extractCollects(doc, cuisine, (doc) => doc.attributes.cuisine);
      extractCollects(doc, denomination, (doc) => doc.attributes.denomination);
      extractCollects(doc, payment, (doc) => doc.attributes.payment);
      extractCollects(doc, rental, (doc) => doc.attributes.rental);

      if (++cnt >= 1000) {
        tot += cnt; cnt = 0;
        logger.info(`Still working... Processed ${tot} documents.`);
      }
    }

    logger.info(`Processed ${tot + cnt} documents, completing advice...`);

    await gc.close();

    // insert keywords

    for (const keyword of keywords.values()) {
      await keywdColl.insertOne({
        ...keyword,
        attributeList: [...keyword.attributeList]
      });
    };

    // insert bounds

    const map2arr = (m) => [...m.keys()].map(key => m.get(key).label);

    await boundColl.insertOne({
      capacity: capacity,
      elevation: elevation,
      minimumAge: minimumAge,
      rating: rating,
      year: year,
      clothes: map2arr(clothes),
      cuisine: map2arr(cuisine),
      denomination: map2arr(denomination),
      payment: map2arr(payment),
      rental: map2arr(rental)
    });

    logger.info(`Advice has been completed.`);
  }
  catch (ex) { logger.error(ex); }
  finally { await client.close(); }
}

advice();
