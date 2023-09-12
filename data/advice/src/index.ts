import Extractor from "./extractor";
import Logger from "./logger";
import Model from "./model";
import { parseArgs } from "./parse";

async function advice() {
  
  const { conn } = parseArgs();

  const logger = new Logger();
  const model = new Model(logger, conn);
  const extractor = new Extractor(logger);

  await model.dropCollection();

  try {
    logger.logCollectingHasBeenStarted();
    const keywords = new Map<string, Item>();

    for await (const place of model) {
      extractor.extract(place, keywords);
    }
    extractor.reportProcessedTot();

    for (const item of Array.from(keywords.values())) {
      await model.create(item);
    }
    model.reportCreatedTot();
  }
  catch (ex) { logger.logError(ex); }
  finally {
    await model.dispose();
  }
}

advice();
