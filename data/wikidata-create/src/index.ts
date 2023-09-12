import { fetchCat } from "./fetch";
import Logger from "./logger";
import Model from "./model";
import { parseArgs } from "./parse";

/**
 * Create entities that exist in the Wikidata unknown to the database.
 */
async function wikidataCreate() {

  const { w, n, e, s, rows, cols, conn, cats } = parseArgs();

  const logger = new Logger();
  const model = new Model(logger, conn);

  try {
    logger.logStarted();

    for (const cat of cats) {
      logger.logCategory(cat);
      const items = await fetchCat(logger, cat, { w: w, n: n, e: e, s: s }, rows, cols);
      await model.create(items);
    }

    logger.logFinished();
  }
  catch (ex) { logger.logError(ex); }
  finally {
    await model.dispose();
  }
}

wikidataCreate();
