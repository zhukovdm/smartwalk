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
    this.logger.info(`[${getTime()}] Started processing OSM keys...`);
  }

  logKeyProcessing(key: string) {
    this.logger.info(`[${getTime()}] > Processing key "${key}"...`);
  }

  logPageProcessing(page: number) {
    this.logger.info(`[${getTime()}] >  Processing page ${page}.`);
  }

  logFailedFetchAttempt(key: string, page: number, attempt: number, err: unknown) {
    this.logger.warn(`[${getTime()}] >   Failed to fetch: key ${key}, page ${page}, attempt ${attempt}.`);
    this.logger.info(err);
  }

  logFinishedKey(key: string, length: number) {
    this.logger.info(`[${getTime()}] > Finished processing key "${key}", extracted ${length} objects.`);
  }

  logFinished() {
    this.logger.info(`[${getTime()}] Finished processing OSM keys.`);
  }

  logError(error: unknown) { this.logger.error(error); }
}
