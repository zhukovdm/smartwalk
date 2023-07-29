import consola from "consola";
import {
  dropDatabase,
  getClient,
  getPlaceCollection
} from "./shared.cjs";

const logger = consola.create();

async function init() {

  const client = getClient();

  try {
    await dropDatabase(client);
    const placeColl = getPlaceCollection(client);

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
