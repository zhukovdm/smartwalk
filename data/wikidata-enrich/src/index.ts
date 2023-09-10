import { fetch } from "./fetch";
import Logger from "./logger";
import Model from "./model";
import { parseArgs } from "./parse";

async function wikidataEnrich() {

  const WINDOW = 100;
  const { conn } = parseArgs();

  const model = new Model(conn);
  const logger = new Logger();

  try {
    let payload = await model.getPayload();
    logger.logPayloadLength(payload.length);

    while (payload.length > 0) {
      const piece = payload.slice(0, WINDOW);
      await model.enrich(logger, await fetch(logger, piece));
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
