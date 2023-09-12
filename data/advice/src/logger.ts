import {
  createLogger,
  format,
  transports,
  type Logger as WinstonLogger
} from "winston";

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

  logCollectionDropped(collName: string) {
    this.logger.info(`Collection ${collName} has been dropped.`);
  }

  logCollectingHasBeenStarted() {
    this.logger.info("Collecting information about stored objects...");
  }

  logProcessedCur(count: number) {
    this.logger.info(`> Still working... Already processed ${count} objects.`);
  }

  logProcessedTot(count: number) {
    this.logger.info(`Processed a total of ${count} documents, completing advice...`);
  }

  logCreatedTot(count: number) {
    this.logger.info(`Created ${count} items, advice has been completed.`);
  }

  logFailedCreate(keyword: string, err: unknown) {
    this.logger.warn(`> Failed to create an item for keyword "${keyword}".`);
    this.logger.info(err);
  }

  logError(err: unknown) { this.logger.error(err); }
}
