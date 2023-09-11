import Logger from "./logger";
import Model from "./model";
import { parseArgs } from "./parse";

async function init() {

  const { conn } = parseArgs();

  const model = new Model(conn);
  const logger = new Logger();

  try {
    await model.dropDatabase();
    await model.createDatabase();

    logger.reportFinished();
  }
  catch (ex) { logger.reportError(ex); }
  finally {
    await model.dispose();
  }
}

init();
