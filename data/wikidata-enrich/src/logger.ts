import {
  createLogger,
  format,
  transports,
  type Logger as WinstonLogger
} from "winston";
import { getTime } from "../../shared/index.js";

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
    this.logger.info(`[${getTime()}] Started processing entities...`);
  }

  logPayloadLength(payloadLength: number) {
    this.logger.info(`[${getTime()}] > Constructed payload with ${payloadLength} unique identifiers.`);
  }

  logFailedFetchAttempt(attempt: number, err: unknown) {
    this.logger.warn(`[${getTime()}] >  Failed to fetch, ${attempt} attempt.`);
    this.logger.info(err);
  }

  logFetchedEntities(fetched: number, given: number) {
    this.logger.info(`[${getTime()}] > Fetched ${fetched} entities for given ${given} identifiers.`);
  }

  logFailedEnrich(wikidataId: string, err: unknown) {
    this.logger.warn(`[${getTime()}] >  Failed to enrich an item with ${wikidataId} identifier.`);
    this.logger.info(err);
  }

  logItemsEnriched(batchEnriched: number, totalEnriched: number) {
    this.logger.info(`[${getTime()}] > Enriched ${batchEnriched} from this batch, enriched total ${totalEnriched} entities.`);
  }

  logFinished() {
    this.logger.info(`[${getTime()}] Finished processing entities.`);
  }

  logError(err: unknown) { this.logger.error(err); }
}
