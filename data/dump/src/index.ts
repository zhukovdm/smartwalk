import Logger from "./logger";
import { parseArgs } from "./parse";
import { KeywordModel, PlaceModel } from "./model";
import Writer from "./writer";

async function dump() {

  const { conn } = parseArgs();

  const logger = new Logger();
  const writer = new Writer(logger);

  const placeModel = new PlaceModel(conn);
  const keywordModel = new KeywordModel(conn);

  try {
    logger.logStarted();

    logger.logPlaces();
    for await (const place of placeModel) {
      writer.writePlace(place);
    }
    writer.reportPlacesProcessed();

    logger.logKeywords();
    for await (const keyword of keywordModel) {
      writer.writeKeyword(keyword);
    }
    writer.reportKeywordsProcessed();

    logger.logFinished();
  }
  catch (ex) { logger.logError(ex); }
  finally {
    placeModel.dispose();
    keywordModel.dispose();
  }
}

dump();
