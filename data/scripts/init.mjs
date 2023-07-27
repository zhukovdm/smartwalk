import consola from "consola";
import { MongoClient } from "mongodb";
import {
  MONGO_CONN_STR,
  MONGO_DATABASE,
  MONGO_PLACE_COLLECTION
} from "./shared.cjs";

const logger = consola.create();

async function init() {

  const client = new MongoClient(MONGO_CONN_STR);

  try {
    await client.db(MONGO_DATABASE).dropDatabase();

    const placeColl = client.db(MONGO_DATABASE).collection(MONGO_PLACE_COLLECTION);

    await placeColl.createIndex({ "linked.osm": 1 });
    await placeColl.createIndex({ "linked.wikidata": 1 });
    await placeColl.createIndex({ "position": "2dsphere" });

    logger.info("Finished setting up database.")
  }
  catch (ex) { logger.error(ex); }
  finally {
    await client.close();
  }
}

init();
