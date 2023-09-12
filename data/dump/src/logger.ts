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
    this.logger.info("Started creating a dump...");
  }

  logPlaces() {
    this.logger.info("> Started processing places...");
  }

  logPlacesAppendedCur(cur: number) {
    this.logger.info(`>  Already processed ${cur} places.`)
  }

  logPlacesAppendedTot(tot: number) {
    this.logger.info(`> Processed a total of ${tot} places.`)
  }

  logKeywords() {
    this.logger.info("> Started processing keywords...");
  }

  logKeywordsAppendedTot(tot: number) {
    this.logger.info(`> Processed a total of ${tot} keywords.`)
  }

  logFinished() {
    this.logger.info("Finished creating a dump.");
  }

  logError(err: unknown) { this.logger.error(err); }
}
