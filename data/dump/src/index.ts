import Logger from "./logger.js";
import Parser from "./parser.js";
import {
  KeywordSource,
  PlaceSource
} from "./source.js";
import Target from "./target.js";

async function dump() {

  const { conn } = new Parser().parseArgs();

  const logger = new Logger();
  const target = new Target(logger);

  const placeSource = new PlaceSource(conn);
  const keywordSource = new KeywordSource(conn);

  try {
    logger.logStarted();

    logger.logPlaces();
    for await (const place of placeSource) {
      target.writePlace(place);
    }
    target.reportPlacesProcessed();

    logger.logKeywords();
    for await (const keyword of keywordSource) {
      target.writeKeyword(keyword);
    }
    target.reportKeywordsProcessed();

    logger.logFinished();
  }
  catch (ex) { logger.logError(ex); }
  finally {
    placeSource.dispose();
    keywordSource.dispose();
  }
}

dump();
