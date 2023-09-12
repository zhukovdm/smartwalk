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

  logStarted() {
    this.logger.info("Started building advice...");
  }

  logCollectionDropped(collName: string) {
    this.logger.info(`> Collection ${collName} has been dropped.`);
  }

  logCollecting() {
    this.logger.info("> Collecting information about stored entities...");
  }

  logProcessedCur(count: number) {
    this.logger.info(`>  Still working... Already processed ${count} entities.`);
  }

  logProcessedTot(count: number) {
    this.logger.info(`> Processed a total of ${count} entities, creating advice items...`);
  }

  logFailedCreate(keyword: string, err: unknown) {
    this.logger.warn(`>  Failed to create an item for keyword "${keyword}".`);
    this.logger.info(err);
  }

  logCreatedTot(count: number) {
    this.logger.info(`> Created ${count} advice items.`);
  }

  logWriteKeywordsToFile() {
    this.logger.info("> Writing keywords to the file...");
  }

  logFinished() {
    this.logger.info("Advice has been completed.");
  }

  logError(err: unknown) { this.logger.error(err); }
}
