import Logger from "./logger";
import { parseArgs } from "./parse";
import { KeywordStore, PlaceStore } from "./store";
import Writer from "./writer";

async function dump() {

  const { conn } = parseArgs();

  const logger = new Logger();
  const writer = new Writer(logger);

  const placeStore = new PlaceStore(conn);
  const keywordStore = new KeywordStore(conn);

  try {
    logger.logStarted();

    logger.logPlaces();
    for await (const place of placeStore) {
      writer.writePlace(place);
    }
    writer.reportPlacesProcessed();

    logger.logKeywords();
    for await (const keyword of keywordStore) {
      writer.writeKeyword(keyword);
    }
    writer.reportKeywordsProcessed();

    logger.logFinished();
  }
  catch (ex) { logger.logError(ex); }
  finally {
    placeStore.dispose();
    keywordStore.dispose();
  }
}

dump();
