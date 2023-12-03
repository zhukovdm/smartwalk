import {
  EnrichLogger as Logger,
  EnrichParser as Parser
} from "../../shared/src/index.js";
import Source from "./source.js";
import Target from "./target.js";

const PAYLOAD_WINDOW = 100;

async function wikidataEnrich() {

  const { conn } = new Parser().parseArgs();

  const logger = new Logger();
  const source = new Source(logger);
  const target = new Target(logger, conn);

  try {
    logger.logStarted();
    let payload = await target.getPayloadIter(PAYLOAD_WINDOW);

    for (const slice of payload) {
      const _e = await source.e(slice);
      const _t = await source.t(_e);
      const _l = await target.l(_t);
    }

    logger.logFinished();
  }
  catch (ex) { logger.logError(ex); }
  finally {
    await target.dispose();
  }
}

wikidataEnrich();
