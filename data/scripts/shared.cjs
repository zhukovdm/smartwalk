const consola = require("consola");
const { MongoClient } = require("mongodb");

const ASSETS_DIR = "../assets";

const MONGO_CONN_STR = "mongodb://localhost:27017";
const MONGO_DATABASE = "smartwalk";
const MONGO_KEYWORD_COLLECTION = "keyword";
const MONGO_PLACE_COLLECTION = "place";

function getClient() {
  return new MongoClient(MONGO_CONN_STR);
}

function dropDatabase(client) {
  return client.db(MONGO_DATABASE).dropDatabase();
}

async function getPayload(client) {
  const target = "linked.wikidata";

  const payload = await client
    .db(MONGO_DATABASE)
    .collection(MONGO_PLACE_COLLECTION)
    .find({ [target]: { $exists: true } })
    .project({ [target]: 1 })
    .toArray();

  return payload.map((item) => "wd:" + item.linked.wikidata);
}

/**
 * Drop a collection defined by a string.
 * @param {MongoClient} client
 * @param {string} collection
 */
function dropMongoCollection(client, collection) {
  return client.db(MONGO_DATABASE).dropCollection(collection);
}

async function dropKeywordCollection(client) {
  return await dropMongoCollection(client, MONGO_KEYWORD_COLLECTION);
}

/**
 * @param {MongoClient} client
 * @param {string} collection
 */
function getMongoCollection(client, collection) {
  return client.db(MONGO_DATABASE).collection(collection);
}

/**
 * @param {MongoClient} client
 */
function getKeywordCollection(client) {
  return getMongoCollection(client, MONGO_KEYWORD_COLLECTION);
}

/**
 * @param {MongoClient} client
 */
function getPlaceCollection(client) {
  return getMongoCollection(client, MONGO_PLACE_COLLECTION);
}

async function writeCreateToDatabase(client, ins) {
  await getPlaceCollection(client)
    .insertOne(ins, { ignoreUndefined: true });
}

async function writeUpdateToDatabase(client, lst, upd) {

  for (const obj of lst) {
    const filter = { "linked.wikidata": { $eq: obj.wikidata } };

    await getPlaceCollection(client)
      .updateMany(filter, upd(obj), { ignoreUndefined: true });
  }
}

function reportError(ex) { consola.error(ex); }

function reportPayload(payload, resource) {
  consola.info(`Constructed ${resource} payload with ${payload.length} items.`);
}

function reportCategory(category) {
  consola.info(`> Processing category ${category}...`);
}

function reportFetchedItems(lst, resource) {
  consola.info(`> Fetched ${lst.length} items from ${resource}.`)
}

function reportEnrichedItems(cnt, tot, resource) {
  consola.info(`> Enriched ${cnt} out of ${tot} items (${Math.floor(cnt * 100 / tot)}%) from ${resource}.`);
}

function reportCreatedItems(cat, cnt, tot) {
  consola.info(`> Created ${cnt} objects for ${cat} category, total ${tot}.`);
}

function reportFinished(resource, tot) {
  consola.info(`Finished processing ${resource}, processed ${tot} items.`);
}

function convertKeywordToName(keyword) {
  return keyword.charAt(0).toUpperCase() + keyword.slice(1);
}

function convertSnakeToKeyword(snake) {
  return snake.toLowerCase().replace('_', ' ');
}

/**
 * Extracted value should have lehgth at least `MIN` chars.
 */
const KEYWORD_LENGTH_LIMIT_MIN = 3;

/**
 * Extracted value should have lehgth at most `MAX` chars.
 */
const KEYWORD_LENGTH_LIMIT_MAX = 30;

/**
 * All extracted keywords should comply with the snake_case-without-underscores
 * pattern (e.g. "medieval_art" ~> "medieval art")
 */
const KEYWORD_PATTERN = /^[a-z]+(?:[ ][a-z]+)*$/;

function isValidKeyword(keyword) {
  return KEYWORD_PATTERN.test(keyword)
    && keyword.length >= KEYWORD_LENGTH_LIMIT_MIN
    && keyword.length <= KEYWORD_LENGTH_LIMIT_MAX
};

function getFirst(obj) { return Array.isArray(obj) ? obj[0] : obj; }

module.exports = {
  ASSETS_DIR,
  convertKeywordToName,
  convertSnakeToKeyword,
  dropDatabase,
  dropKeywordCollection,
  getClient,
  getFirst,
  getKeywordCollection,
  getPayload,
  getPlaceCollection,
  isValidKeyword,
  reportCategory,
  reportCreatedItems,
  reportEnrichedItems,
  reportError,
  reportFetchedItems,
  reportFinished,
  reportPayload,
  writeCreateToDatabase,
  writeUpdateToDatabase
};
