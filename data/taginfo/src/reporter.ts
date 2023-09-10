import consola, { type ConsolaInstance } from "consola";

export class Reporter {

  private readonly logger: ConsolaInstance;

  constructor() {
    this.logger = consola.create({});
  }

  reportKeys(keys: string[]) {
    this.logger.info(`Started processing OSM keys ${keys.join(", ")}.`);
  }

  reportKeyProcessing(key: string) {
    this.logger.info(`> Processing key ${key}.`);
  }

  reportPageProcessing(page: number) {
    this.logger.info(`>  Processing page ${page}.`);
  }

  reportFailedFetchAttempt(key: string, page: number, attempt: number) {
    this.logger.info(`> Failed to fetch: key ${key}, page ${page}, attempt ${attempt}.`);
  }

  reportFinishedKey(key: string, length: number) {
    this.logger.info(`> Finished processing key ${key}, extracted ${length} objects.`);
  }

  reportFinished() {
    this.logger.info(`Finished processing OSM keys.`);
  }

  reportError(error: unknown) { this.logger.error(error); }
}
