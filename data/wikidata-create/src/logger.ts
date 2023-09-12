import {
  createLogger,
  format,
  transports,
  type Logger as WinstonLogger
} from "winston";

const paddedWithZeros = (num: number) => (String(num).padStart(2, "0"));

function getTimestamp() {
  const date = new Date();
  return `${paddedWithZeros(date.getHours())}:${paddedWithZeros(date.getMinutes())}:${paddedWithZeros(date.getSeconds())}`;
};

export default class Logger {

  private readonly logger: WinstonLogger;

  constructor() {
    this.logger = createLogger({
      level: "info",
      format: format.combine(format.colorize(), format.simple()),
      transports: [
        new transports.Console()
      ]
    });
  }

  logStarted() {
    this.logger.info("Started processing categories...");
  }

  logCategory(cat: string) {
    this.logger.info(`> Processing category ${cat}...`);
  }

  logCategoryBbox({ w, n, e, s }: Bbox) {
    this.logger.info(`>  [${getTimestamp()}] Contacting Wikidata SPARQL endpoint for square w=${w} n=${n} e=${e} s=${s}...`);
  }

  logFailedFetchAttempt(attempt: number, err: unknown) {
    this.logger.warn(`>   Failed to fetch, ${attempt} attempt.`);
    this.logger.info(err);
  }

  logFetchedEntities(cat: string, count: number) {
    this.logger.info(`>  Fetched ${count} entities for ${cat} category.`);
  }

  logCreatingObjects() {
    this.logger.info(">  Creating objects for fetched batch...");
  }

  logFailedCreate(wikidataId: string, err: unknown) {
    this.logger.warn(`>  Failed to create an item with ${wikidataId} identifier.`);
    this.logger.info(err);
  }

  logItemsCreated(batchCreated: number, totalCreated: number) {
    this.logger.info(`>  Created ${batchCreated} from this batch, created total ${totalCreated} entities.`)
  }

  logFinished() {
    this.logger.info(`Finished processing categories.`);
  }

  logError(err: unknown) { this.logger.error(err); }
}
