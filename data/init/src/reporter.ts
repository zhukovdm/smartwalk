import consola, { type ConsolaInstance } from "consola";

export default class Reporter {

  private readonly logger: ConsolaInstance;

  constructor() {
    this.logger = consola.create({});
  }

  public reportFinished() {
    this.logger.info("Finished setting up database.");
  }

  public reportError(err: unknown) { this.logger.error(err); }
}
