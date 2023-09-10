import Model from "./model";
import { parseArgs } from "./parser";
import Reporter from "./reporter";

async function init() {

  const { conn } = parseArgs();

  const model = new Model(conn);
  const reporter = new Reporter();

  try {
    await model.dropDatabase();
    await model.createDatabase();

    reporter.reportFinished();
  }
  catch (ex) { reporter.reportError(ex); }
  finally {
    await model.dispose();
  }
}

init();
