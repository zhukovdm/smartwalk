import {
  SimpleParser as Parser
} from "../../shared/dist/src/index.js";
import Logger from "./logger.js";
import {
  getKeywordLines,
  getPlaceLines
} from "./source.js";
import Target from "./target.js";

async function restore() {

  const { conn } = new Parser().parseArgs();

  const logger = new Logger();
  const target = new Target(logger, conn);

  try {
    logger.logStarted();
    logger.logStartedPlaces();

    for await (const placeLine of getPlaceLines()) {
      await target.createPlace(JSON.parse(placeLine));
    }
    await target.flushRemainingPlaces();

    logger.logStartedKeywords();

    for await (const keywordLine of getKeywordLines()) {
      await target.createKeyword(JSON.parse(keywordLine));
    }
    await target.flushRemainingKeywords();

    logger.logFinished();
  }
  catch (ex) { logger.logError(ex); }
  finally {
    await target.dispose();
  }
}

restore();
