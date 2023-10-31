import { fetchBbox } from "./fetch";
import Logger from "./logger";
import Model from "./model";
import { parseArgs } from "./parse";

/**
 * Create entities that exist in the Wikidata unknown to the database.
 */
async function wikidataCreate() {

  const { w, n, e, s, rows, cols, conn } = parseArgs();

  const logger = new Logger();
  const model = new Model(logger, conn);

  try {
    logger.logStarted();

    const items = await fetchBbox(logger, { w: w, n: n, e: e, s: s }, rows, cols);
    await model.write(items);

    logger.logFinished();
  }
  catch (ex) { logger.logError(ex); }
  finally {
    await model.dispose();
  }
}

wikidataCreate();
