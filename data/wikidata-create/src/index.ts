import Logger from "./logger.js";
import Parser from "./parser.js";
import Pipeline from "./pipeline.js";
import Source from "./source.js";
import Target from "./target.js";

/**
 * Create entities that exist in the Wikidata unknown to the entity store.
 */
async function wikidataCreate() {

  const { w, n, e, s, rows, cols, conn } = new Parser().parseArgs();

  const logger = new Logger();
  const source = new Source(logger);
  const target = new Target(logger, conn);

  try {
    logger.logStarted();
    const pipeline = new Pipeline(source, target);

    const _e = await pipeline.e({ w, n, e, s }, rows, cols);
    const _t = await pipeline.t(_e);
    const _l = await pipeline.l(_t);

    logger.logFinished();
  }
  catch (ex) { logger.logError(ex); }
  finally {
    await target.dispose();
  }
}

wikidataCreate();
