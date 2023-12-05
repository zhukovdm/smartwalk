import {
  SimpleParser as Parser
} from "../../shared/dist/src/index.js";
import Logger from "./logger.js";
import Source from "./source.js";
import Target from "./target.js";
import Transformer from "./transformer.js";
import writeToFile from "./writer.js";

async function advice() {
  
  const { conn } = new Parser().parseArgs();

  const logger = new Logger();
  const source = new Source(conn);
  const target = new Target(logger, conn);

  const transformer = new Transformer(logger);

  logger.logStarted();
  await target.init(); // !

  try {
    logger.logCollecting();
    const keywords = new Map<string, Item>();

    for await (const place of source) {
      transformer.reduce(place, keywords);
    }
    transformer.reportProcessedTot();

    const items = Array.from(keywords.values())
      .sort((l, r) => (l.keyword.localeCompare(r.keyword)));

    for (const item of items) {
      await target.load(item);
    }
    target.reportCreatedTot();

    logger.logWriteKeywordsToFile();
    writeToFile(items.map(({ keyword }) => keyword));

    logger.logFinished();
  }
  catch (ex) { logger.logError(ex); }
  finally {
    await source.dispose();
    await target.dispose();
  }
}

advice();
