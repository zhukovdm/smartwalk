import { fetchCat } from "./fetch";
import Logger from "./logger";
import Model from "./model";
import { parseArgs } from "./parse";

/**
 * Create entities that exist in the Wikidata unknown to the database.
 */
async function wikidataCreate() {

  const { w, n, e, s, rows, cols, conn, cats } = parseArgs();

  const model = new Model(conn);
  const logger = new Logger();

  try {
    for (const cat of cats) {
      logger.logCategory(cat);
      const items = await fetchCat(logger, cat, { w: w, n: n, e: e, s: s }, rows, cols);
      await model.create(logger, items);
    }
    logger.logFinished();
  }
  catch (ex) { logger.logError(ex); }
  finally {
    await model.dispose();
  }
}

wikidataCreate();
