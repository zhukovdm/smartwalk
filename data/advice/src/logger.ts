import {
  createLogger,
  format,
  transports,
  type Logger as WinstonLogger
} from "winston";
import { getTime } from "../../shared/dist/src/index.js";

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
    this.logger.info(`[${getTime()}] Started building advice...`);
  }

  logCollectionDropped(collName: string) {
    this.logger.info(`[${getTime()}] > Collection ${collName} has been dropped.`);
  }

  logCollecting() {
    this.logger.info(`[${getTime()}] > Collecting information about stored entities...`);
  }

  logProcessedCur(count: number) {
    this.logger.info(`[${getTime()}] >  Still working... Already processed ${count} entities.`);
  }

  logProcessedTot(count: number) {
    this.logger.info(`[${getTime()}] > Processed a total of ${count} entities, creating advice items...`);
  }

  logFailedCreate(keyword: string, err: unknown) {
    this.logger.warn(`[${getTime()}] >  Failed to create an item for keyword "${keyword}".`);
    this.logger.info(err);
  }

  logCreatedTot(count: number) {
    this.logger.info(`[${getTime()}] > Created ${count} advice items.`);
  }

  logWriteKeywordsToFile() {
    this.logger.info(`[${getTime()}] > Writing keywords to the file...`);
  }

  logFinished() {
    this.logger.info(`[${getTime()}] Advice has been completed.`);
  }

  logError(err: unknown) { this.logger.error(err); }
}
