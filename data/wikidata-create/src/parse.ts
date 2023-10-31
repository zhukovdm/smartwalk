import { Command } from "commander";

/**
 * Define south-west, north-east bounding points and subdivision.
 */
export function parseArgs(): {
  w: number;
  n: number;
  e: number;
  s: number;
  rows: number;
  cols: number;
  conn: string;
} {
  const args = new Command()
    .option("--w <number>", "West coordinate", parseFloat)
    .option("--n <number>", "North coordinate", parseFloat)
    .option("--e <number>", "East coordinate", parseFloat)
    .option("--s <number>", "South coordinate", parseFloat)
    .option("--rows <number>", "Rows in a grid", parseInt)
    .option("--cols <number>", "Cols in a grid", parseInt)
    .option("--conn <string>", "Database connection string");
  return args.parse().opts();
}
