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
    this.logger.info("Started restoring a dump...");
  }

  logStartedPlaces() {
    this.logger.info("> Started processing places...");
  }

  logPlacesCur(count: number) {
    this.logger.info(`>  Created ${count} places.`);
  }

  logPlacesTot(count: number) {
    this.logger.info(`> Created a total of ${count} places.`);
  }

  logStartedKeywords() {
    this.logger.info("> Started processing keywords...");
  }

  logKeywordsTot(count: number) {
    this.logger.info(`> Created a total of ${count} keywords.`);
  }

  logFinished() {
    this.logger.info("The dump has been restored.");
  }

  logError(err: unknown) { this.logger.error(err); }
}
