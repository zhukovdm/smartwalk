import { Command } from "commander";

export function parseArgs(): {
  conn: string;
} {
  const args = new Command()
    .option("--conn <string>", "Database connection string");
  return args.parse().opts();
}
