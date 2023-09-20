import Extractor from "./extractor";
import Logger from "./logger";
import Model from "./model";
import { parseArgs } from "./parse";
import writeToFile from "./write";

async function advice() {
  
  const { conn } = parseArgs();

  const logger = new Logger();
  const model = new Model(logger, conn);
  const extractor = new Extractor(logger);

  logger.logStarted();
  await model.safeDropCollection();

  try {
    logger.logCollecting();
    const keywords = new Map<string, Item>();

    for await (const place of model) {
      extractor.extract(place, keywords);
    }
    extractor.reportProcessedTot();

    const items = Array.from(keywords.values())
      .sort((l, r) => (l.keyword.localeCompare(r.keyword)));

    for (const item of items) {
      await model.create(item);
    }
    model.reportCreatedTot();

    logger.logWriteKeywordsToFile();
    writeToFile(items.map(({ keyword }) => keyword));

    logger.logFinished();
  }
  catch (ex) { logger.logError(ex); }
  finally {
    await model.dispose();
  }
}

advice();
