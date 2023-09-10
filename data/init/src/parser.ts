import { Command } from "commander";

export function parseArgs(): { conn: string } {
  return new Command() .option("--conn [string]").parse().opts();
}
