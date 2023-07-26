import consola from "consola";
import { MongoClient } from "mongodb";
import {
  MONGO_CONNECTION_STRING,
  MONGO_DATABASE,
  MONGO_GRAIN_COLLECTION,
  MONGO_INDEX_COLLECTION
} from "./shared.cjs";

const logger = consola.create();

async function init() {

  const client = new MongoClient(MONGO_CONNECTION_STRING);

  try {
    await client.db(MONGO_DATABASE).dropDatabase();

    const grain = client.db(MONGO_DATABASE).collection(MONGO_GRAIN_COLLECTION);
    const index = client.db(MONGO_DATABASE).collection(MONGO_INDEX_COLLECTION);

    await grain.createIndex({ "linked.osm": 1 });
    await grain.createIndex({ "linked.wikidata": 1 });
    await grain.createIndex({ "position": "2dsphere" });

    logger.info("Finished setting up database.")
  }
  catch (ex) { logger.error(ex); }
  finally { await client.close(); }
}

init();
