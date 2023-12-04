import {
  EnrichLogger as Logger,
  SimpleParser as Parser
} from "../../shared/dist/src/index.js";
import Pipeline from "./pipeline.js";
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

    const pipeline = new Pipeline(source, target);

    for (const slice of payload) {
      const _e = await pipeline.e(slice);
      const _t = await pipeline.t(_e);
      const _l = await pipeline.l(_t);
    }

    logger.logFinished();
  }
  catch (ex) { logger.logError(ex); }
  finally {
    await target.dispose();
  }
}

wikidataEnrich();
