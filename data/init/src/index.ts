import {
  SimpleParser as Parser
} from "../../shared/dist/src/index.js";
import Logger from "./logger.js";
import Target from "./target.js";

async function init() {

  const { conn } = new Parser().parseArgs();

  const logger = new Logger();
  const target = new Target(logger, conn);

  try {
    await target.dropDatabase();
    await target.createDatabase();

    logger.reportFinished();
  }
  catch (ex) { logger.reportError(ex); }
  finally {
    await target.dispose();
  }
}

init();
