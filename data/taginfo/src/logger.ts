import {
  createLogger,
  format,
  transports,
  type Logger as WinstonLogger
} from "winston";

export class Logger {

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

  logKeys() {
    this.logger.info(`Started processing OSM keys...`);
  }

  logKeyProcessing(key: string) {
    this.logger.info(`> Processing key "${key}"...`);
  }

  logPageProcessing(page: number) {
    this.logger.info(`>  Processing page ${page}.`);
  }

  logFailedFetchAttempt(key: string, page: number, attempt: number, err: unknown) {
    this.logger.warn(`>   Failed to fetch: key ${key}, page ${page}, attempt ${attempt}.`);
    this.logger.info(err);
  }

  logFinishedKey(key: string, length: number) {
    this.logger.info(`> Finished processing key "${key}", extracted ${length} objects.`);
  }

  logFinished() {
    this.logger.info(`Finished processing OSM keys.`);
  }

  logError(error: unknown) { this.logger.error(error); }
}
