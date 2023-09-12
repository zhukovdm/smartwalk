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
    this.logger.info("Started processing entities...");
  }

  logPayloadLength(payloadLength: number) {
    this.logger.info(`> Constructed payload with ${payloadLength} unique identifiers.`);
  }

  logFailedFetchAttempt(attempt: number, err: unknown) {
    this.logger.warn(`>  Failed to fetch, ${attempt} attempt.`);
    this.logger.info(err);
  }

  logFetchedEntities(fetched: number, given: number) {
    this.logger.info(`> Fetched ${fetched} entities for given ${given} identifiers.`);
  }

  logFailedEnrich(wikidataId: string, err: unknown) {
    this.logger.warn(`>  Failed to enrich an item with ${wikidataId} identifier.`);
    this.logger.info(err);
  }

  logItemsEnriched(batchEnriched: number, totalEnriched: number) {
    this.logger.info(`> Enriched ${batchEnriched} from this batch, enriched total ${totalEnriched} entities.`);
  }

  logFinished() {
    this.logger.info("Finished processing entities.");
  }

  logError(err: unknown) { this.logger.error(err); }
}
