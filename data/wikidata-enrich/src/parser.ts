import { Command } from "commander";

export default class Parser {

  /**
   * Pass connection string.
   */
  parseArgs(): {
    conn: string;
  } {
    const args = new Command()
      .option("--conn <string>", "Database connection string");
    return args.parse().opts();
  }
}
