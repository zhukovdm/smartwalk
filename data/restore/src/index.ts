import Logger from "./logger";
import Model from "./model";
import { parseArgs } from "./parse";
import {
  getKeywordLines,
  getPlaceLines
} from "./reader";

async function restore() {

  const { conn } = parseArgs();

  const logger = new Logger();
  const model = new Model(logger, conn);

  try {
    logger.logStarted();

    logger.logStartedPlaces();

    for await (const placeLine of getPlaceLines()) {
      await model.createPlace(JSON.parse(placeLine));
    }
    await model.flushPlaces();

    logger.logStartedKeywords();

    for await (const keywordLine of getKeywordLines()) {
      await model.createKeyword(JSON.parse(keywordLine));
    }
    await model.flushKeywords();

    logger.logFinished();
  }
  catch (ex) { logger.logError(ex); }
  finally {
    await model.dispose();
  }
}

restore();
