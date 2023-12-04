import {
  createLogger,
  format,
  transports,
  type Logger as WinstonLogger
} from "winston";
import { getTime } from "../../shared/dist/src/index.js"

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
    this.logger.info(`[${getTime()}] Started processing bounding box...`);
  }

  logSquare({ w, n, e, s }: Bbox) {
    this.logger.info(`[${getTime()}] > Contacting Wikidata SPARQL endpoint for square w=${w} n=${n} e=${e} s=${s}...`);
  }

  logFailedFetchAttempt(attempt: number, err: unknown) {
    this.logger.warn(`[${getTime()}] >  Failed to fetch, ${attempt} attempt.`);
    this.logger.info(err);
  }

  logFetchedEntities(count: number) {
    this.logger.info(`[${getTime()}] > Fetched ${count} entities.`);
  }

  logWritingObjects() {
    this.logger.info(`[${getTime()}] > Writing objects for fetched batch...`);
  }

  logFailedWrite(wikidataId: string, err: unknown) {
    this.logger.warn(`[${getTime()}] >  Failed to write an item with ${wikidataId} identifier.`);
    this.logger.info(err);
  }

  logItemsWritten(updated: number, created: number) {
    this.logger.info(`[${getTime()}] > Updated ${updated}, created ${created} entities.`);
  }

  logFinished() {
    this.logger.info(`[${getTime()}] Finished processing objects.`);
  }

  logError(err: unknown) { this.logger.error(err); }
}
