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

  public logPayloadLength(payloadLength: number) {
    this.logger.info(`Constructed payload with ${payloadLength} items.`);
  }

  public logFailedFetchAttempt(attempt: number, err: unknown) {
    this.logger.warn(`>  Failed to fetch, ${attempt} attempt.`);
    this.logger.info(err);
  }

  public logFetchedEntities(fetched: number, given: number) {
    this.logger.info(`> Fetched ${fetched} entities for given ${given} identifiers.`);
  }

  public logFailedEnrich(wikidata: string, err: unknown) {
    this.logger.warn(`>  Failed to enrich an item with ${wikidata} identifier.`);
    this.logger.info(err);
  }

  public logItemsEnriched(batchEnriched: number, totalEnriched: number) {
    this.logger.info(`> Enriched ${batchEnriched} from this batch, enriched total ${totalEnriched} entities.`);
  }

  public logFinished() {
    this.logger.info(`Finished processing. Exiting...`);
  }

  public logError(err: unknown) { this.logger.error(err); }
}
