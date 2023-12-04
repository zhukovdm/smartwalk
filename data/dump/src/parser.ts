import { Command } from "commander";

export default class Parser {

  /**
   * Reads connection string.
   */
  parseArgs(): { conn: string } {
    const args = new Command()
      .option("--conn <string>", "Database connection string");
    return args.parse().opts();
  }
}
