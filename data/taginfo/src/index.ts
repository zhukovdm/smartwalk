import Logger from "./logger.js";
import Source from "./source.js";
import Target from "./target.js";

/**
 * Get possible values of the most popular tags with their frequencies.
 * 
 * https://taginfo.openstreetmap.org/taginfo/apidoc#api_4_key_values
 */
async function taginfo(keys: string[]) {
  const logger = new Logger();

  try {
    logger.logStarted();

    for (const key of keys) {
      logger.logKeyProcessing(key);
      const source = new Source(logger);
      const target = new Target();

      const _e = await source.e(key);
      const _t = await source.t(_e);
      const _l = await target.l(key, _t);

      logger.logFinishedKey(key, _t.length);
    }

    logger.logFinished();
  }
  catch (ex) { logger.logError(ex); }
}

taginfo(process.argv.slice(2));
