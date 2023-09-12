import { fetch } from "./fetch";
import Logger from "./logger";
import Model from "./model";
import { parseArgs } from "./parse";

async function wikidataEnrich() {

  const WINDOW = 100;
  const { conn } = parseArgs();

  const logger = new Logger();
  const model = new Model(logger, conn);

  try {
    logger.logStarted();

    let payload = await model.getPayload();

    while (payload.length > 0) {
      const slice = payload.slice(0, WINDOW);
      const items = await fetch(logger, slice);
      await model.enrich(items);
      payload = payload.slice(WINDOW);
    }

    logger.logFinished();
  }
  catch (ex) { logger.logError(ex); }
  finally {
    await model.dispose();
  }
}

wikidataEnrich();
