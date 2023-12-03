import Logger from "./logger.js";
import Parser from "./parser.js";
import Source from "./source.js";
import Target from "./target.js";

/**
 * Create entities that exist in the Wikidata unknown to the entity store.
 */
async function wikidataCreate() {

  const logger = new Logger();
  const { w, n, e, s, rows, cols, conn } = new Parser().parseArgs();

  const source = new Source(logger);
  const target = new Target(logger, conn);

  try {
    logger.logStarted();

    const _e = await source.e({ w, n, e, s }, rows, cols);
    const _t = await source.t(_e);
    const _l = await target.l(_t);

    logger.logFinished();
  }
  catch (ex) { logger.logError(ex); }
  finally {
    await target.dispose();
  }
}

wikidataCreate();
