import {
  createLogger,
  format,
  transports,
  type Logger as WinstonLogger
} from "winston";

const paddedWithZeros = (num: number) => (String(num).padStart(2, "0"));

function getTimestamp() {
  const date = new Date();
  return `${paddedWithZeros(date.getHours())}:${paddedWithZeros(date.getMinutes())}:${paddedWithZeros(date.getSeconds())}`;
};

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
    this.logger.info("Started processing bounding box...");
  }

  logSquare({ w, n, e, s }: Bbox) {
    this.logger.info(`>  [${getTimestamp()}] Contacting Wikidata SPARQL endpoint for square w=${w} n=${n} e=${e} s=${s}...`);
  }

  logFailedFetchAttempt(attempt: number, err: unknown) {
    this.logger.warn(`>   Failed to fetch, ${attempt} attempt.`);
    this.logger.info(err);
  }

  logFetchedEntities(count: number) {
    this.logger.info(`>  Fetched ${count} entities.`);
  }

  logWritingObjects() {
    this.logger.info(">  Writing objects for fetched batch...");
  }

  logFailedWrite(wikidataId: string, err: unknown) {
    this.logger.warn(`>  Failed to write an item with ${wikidataId} identifier.`);
    this.logger.info(err);
  }

  logItemsWritten(batchWritten: number, totalWritten: number) {
    this.logger.info(`>  Wrote ${batchWritten} from this batch, written total ${totalWritten} entities.`);
  }

  logFinished() {
    this.logger.info(`Finished processing objects.`);
  }

  logError(err: unknown) { this.logger.error(err); }
}
