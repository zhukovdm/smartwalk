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

  public logCategory(cat: string) {
    this.logger.info(`> Processing category ${cat}...`);
  }

  public logCategoryBbox(cat: string, { w, n, e ,s }: Bbox) {
    this.logger.info(`>  Contacting Wikidata SPARQL endpoint for square w=${w} n=${n} e=${e} s=${s} and category ${cat}.`);
  }

  public logFailedFetchAttempt(attempt: number, err: unknown) {
    this.logger.warn(`>  Failed to fetch, ${attempt} attempt.`);
    this.logger.info(err);
  }

  public logFetchedEntities(cat: string, count: number) {
    this.logger.info(`> Fetched ${count} entities for ${cat} category.`);
  }

  public logFailedCreate(wikidata: string, err: unknown) {
    this.logger.warn(`>  Failed to create an item with ${wikidata} identifier.`);
    this.logger.info(err);
  }

  public logItemsCreated(batchCreated: number, totalCreated: number) {
    this.logger.info(`> Created ${batchCreated} from this batch, created total ${totalCreated} entities.`)
  }

  public logFinished() {
    this.logger.info(`Finished processing. Exiting...`);
  }

  public logError(err: unknown) { this.logger.error(err); }
}
