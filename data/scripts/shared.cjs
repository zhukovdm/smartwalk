const consola = require("consola");

const ASSETS_BASE_ADDR = "../assets";

const MONGO_DATABASE = "grainpath";
const MONGO_GRAIN_COLLECTION = "grain";
const MONGO_INDEX_COLLECTION = "index";
const MONGO_CONNECTION_STRING = process.env.GRAINPATH_DBM_CONN;

async function getPayload(client) {
  const tar = "linked.wikidata";

  const payload = await client
    .db(MONGO_DATABASE)
    .collection(MONGO_GRAIN_COLLECTION)
    .find({ [tar]: { $exists: true } })
    .project({ [tar]: 1 })
    .toArray();

  return payload.map((item) => "wd:" + item.linked.wikidata);
}

function getMongoCollection(client, collection) {
  return client.db(MONGO_DATABASE).collection(collection);
}

function getGrainCollection(client) {
  return getMongoCollection(client, MONGO_GRAIN_COLLECTION);
}

function getIndexCollection(client) {
  return getMongoCollection(client, MONGO_INDEX_COLLECTION);
}

async function writeCreateToDatabase(client, ins) {
  await getGrainCollection(client)
    .insertOne(ins, { ignoreUndefined: true });
}

async function writeUpdateToDatabase(client, lst, upd) {

  for (const obj of lst) {
    const filter = { "linked.wikidata": { $eq: obj.wikidata } };

    await getGrainCollection(client)
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
  consola.info(`> Fetched ${lst.length} valid items from ${resource}.`);
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
 * pattern.
 */
const KEYWORD_PATTERN = /^[a-z]+(?:[ ][a-z]+)*$/;

function isValidKeyword(keyword) {
  return (new RegExp(KEYWORD_PATTERN)).test(keyword)
    && keyword.length >= KEYWORD_LENGTH_LIMIT_MIN
    && keyword.length <= KEYWORD_LENGTH_LIMIT_MAX
};

module.exports = {
  ASSETS_BASE_ADDR: ASSETS_BASE_ADDR,
  MONGO_DATABASE: MONGO_DATABASE,
  MONGO_GRAIN_COLLECTION: MONGO_GRAIN_COLLECTION,
  MONGO_INDEX_COLLECTION: MONGO_INDEX_COLLECTION,
  MONGO_CONNECTION_STRING: MONGO_CONNECTION_STRING,
  getPayload: getPayload,
  getGrainCollection: getGrainCollection,
  getIndexCollection: getIndexCollection,
  writeUpdateToDatabase: writeUpdateToDatabase,
  writeCreateToDatabase: writeCreateToDatabase,
  reportError: reportError,
  reportPayload: reportPayload,
  reportCategory: reportCategory,
  reportFetchedItems: reportFetchedItems,
  reportCreatedItems: reportCreatedItems,
  reportFinished: reportFinished,
  convertKeywordToName: convertKeywordToName,
  convertSnakeToKeyword: convertSnakeToKeyword,
  isValidKeyword: isValidKeyword
};
