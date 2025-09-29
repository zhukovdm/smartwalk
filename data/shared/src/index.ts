import { Command } from "commander";
import {
  Collection,
  MongoClient
} from "mongodb";
import {
  createLogger,
  format,
  transports,
  type Logger as WinstonLogger
} from "winston";

/** Extracted value should have lehgth at least `MIN` chars. */
const KEYWORD_LENGTH_LIMIT_MIN = 3;

/** Extracted value should have lehgth at most `MAX` chars. */
const KEYWORD_LENGTH_LIMIT_MAX = 50;

/**
 * All extracted keywords should comply with the snake_case-without-underscores
 * pattern (e.g. "medieval_art" ~> "medieval art")
 */
const KEYWORD_PATTERN = /^[a-z]+(?:[ ][a-z]+)*$/;

/**
 * @param keyword Input string.
 * @returns True if the input string is a valid keyword.
 */
export function isValidKeyword(keyword: string): boolean {
  return KEYWORD_PATTERN.test(keyword)
    && keyword.length >= KEYWORD_LENGTH_LIMIT_MIN
    && keyword.length <= KEYWORD_LENGTH_LIMIT_MAX;
}

/**
 * Number of digits after comma in a coordinate.
 */
const LOCATION_PRECISION = 7;

/**
 * @param num latitude or longitude in degrees.
 * @returns rounded number.
 */
export function roundCoordinate(num: number): number {
  return parseFloat(num.toFixed(LOCATION_PRECISION));
}

/**
 * @param obj Maybe array.
 * @returns First element of the array.
 */
export function getFirst(obj: unknown) {
  return (Array.isArray(obj)) ? obj[0] : obj;
}

/**
 * @returns Array or wraps a value into an array.
 */
export function ensureArray<T>(t: T | T[]): T[] {
  return (Array.isArray(t) ? t : [t]);
}

const paddedWithZeros = (num: number) => (String(num).padStart(2, "0"));

/**
 * @returns Current time in HH:MM:SS.
 */
export function getTime(): string {
  const date = new Date();
  return `${paddedWithZeros(date.getHours())}:${paddedWithZeros(date.getMinutes())}:${paddedWithZeros(date.getSeconds())}`;
};

/**
 * @returns Current date and time in YYYY-MM-DD HH:MM:SS.
 */
export function getDateTime(): string {
  const date = new Date();
  return `${date.getFullYear()}-${paddedWithZeros(date.getMonth() + 1)}-${paddedWithZeros(date.getDate())} ${paddedWithZeros(date.getHours())}:${paddedWithZeros(date.getMinutes())}:${paddedWithZeros(date.getSeconds())}`
}

/**
 * @param payload List of items.
 * @param window Number of item in one batch.
 * @returns Generator.
 */
export function getPayloadIter<T>(payload: T[], window: number, logger: EnrichLogger): {
  [Symbol.iterator](): Generator<T[], void, unknown>;
} {
  let length = payload.length;
  return {
    *[Symbol.iterator]() {
      while (payload.length > 0) {
        yield payload.slice(0, window);
        payload = payload.slice(window);
        logger.logPayloadRemain(1 - (length - payload.length) / length);
      }
    }
  }
}

export class SafeFetcher<T> {
  private readonly attempts: number;
  private readonly initwait: number;
  private readonly failwait: number;

  /**
   * @param attempts Number of retries.
   * @param initwait Seconds before the first attempt (pause between batches).
   * @param failwait Seconds upon fail till the next attempt.
   */
  constructor(attempts: number, initwait: number, failwait: number) {
    this.attempts = attempts;
    this.initwait = initwait;
    this.failwait = failwait;
  }

  /**
   * Wait for N seconds.
   * @param seconds length of the time interval (in seconds).
   */
  private static wait(seconds: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000.0));
  }

  /**
   * Safe fetch with retry.
   * @param unsafeFetch unsafe callback.
   * @param reportFail every attempt is reported.
   * @param defaultValue Value to return if all attempts have failed.
   */
  async fetchWithRetry(
    unsafeFetch: () => Promise<T>,
    reportFail: (attempt: number, err: unknown) => void,
    defaultValue: T
  ): Promise<T> {
    let result: T | undefined = undefined;

    let attempt = 0;
    await SafeFetcher.wait(this.initwait);

    do {
      ++attempt;
      try {
        result = await unsafeFetch();
      }
      catch (err) {
        reportFail(attempt, err);
        await SafeFetcher.wait(this.failwait);
      }
    } while (result === undefined && attempt < this.attempts);

    return result ?? defaultValue;
  }
}

export class SimpleParser {

  /**
   * Read connection string.
   */
  parseArgs(): { conn: string } {
    const args = new Command()
      .option("--conn <string>", "Database connection string");
    return args.parse().opts();
  }
}

export class EnrichLogger {

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
    this.logger.info(`[${getTime()}] Started processing entities...`);
  }

  logPayloadLength(payloadLength: number) {
    this.logger.info(`[${getTime()}] > Constructed payload with ${payloadLength} unique identifiers.`);
  }

  logPayloadRemain(payloadRatio: number) {
    this.logger.info(`[${getTime()}] > ${(payloadRatio * 100.0).toFixed(0)}% of the initial payload are left...`);
  }

  logFailedFetchAttempt(attempt: number, err: unknown) {
    this.logger.warn(`[${getTime()}] >  Failed to fetch, ${attempt} attempt.`);
    this.logger.info(err);
  }

  logFetchedEntities(fetched: number, given: number) {
    this.logger.info(`[${getTime()}] > Fetched ${fetched} entities for given ${given} identifiers.`);
  }

  logFailedEnrich(wikidataId: string, err: unknown) {
    this.logger.warn(`[${getTime()}] >  Failed to enrich an item with ${wikidataId} identifier.`);
    this.logger.info(err);
  }

  logItemsEnriched(batchEnriched: number, totalEnriched: number) {
    this.logger.info(`[${getTime()}] > Enriched ${batchEnriched} from this batch, enriched total ${totalEnriched} entities.`);
  }

  logFinished() {
    this.logger.info(`[${getTime()}] Finished processing entities.`);
  }

  logError(err: unknown) { this.logger.error(err); }
}

export abstract class EnrichSource<S> {
  private readonly logger: EnrichLogger;

  constructor(logger: EnrichLogger) {
    this.logger = logger;
  }

  abstract getQuery(items: string[]): string;

  abstract fetchFrom(query: string): Promise<S[]>;

  async load(items: string[]): Promise<S[]> {

    const result = await new SafeFetcher<S[]>(3, 3, 10)
      .fetchWithRetry(
        () => this.fetchFrom(this.getQuery(items)),
        (attempt: number, err: unknown) => {
          this.logger.logFailedFetchAttempt(attempt, err);
        },
        []
      );
    this.logger.logFetchedEntities(result.length, items.length);
    return result;
  }
}

export abstract class EnrichTarget<T> {

  protected readonly client: MongoClient;
  protected readonly collection: Collection;

  constructor(conn: string) {
    this.client = new MongoClient(conn);
    this.collection = this.client.db("smartwalk").collection("places");
  }

  abstract load(items: T[]): Promise<void>;

  /**
   * Get all place identifiers in the database.
   * @param window Maximum number of items in one batch.
   * @returns Iterator over a list of identifiers.
   */
  protected async getPayload(): Promise<string[]> {
    const target = "linked.wikidata";

    let promise = this.collection
      .find({ [target]: { $exists: true } })
      .project({ [target]: 1 })
      .toArray();

    return (await promise)
      .map((doc) => `wd:${doc.linked.wikidata}`);
  }
}

export abstract class EnrichTransformer<S, T> {

  abstract constructFromEntity(entity: S): T;

  /**
   * Transform raw items into well-formed ones.
   * @param ts raw items.
   * @returns proper items.
   */
  transform(items: S[]): Promise<T[]> {
    const us = items.map((entity) => this.constructFromEntity(entity));
    return Promise.resolve(us);
  }
}

export abstract class EnrichPipeline<S, T> {

  private readonly source: EnrichSource<S>;
  private readonly target: EnrichTarget<T>;
  private readonly transformer: EnrichTransformer<S, T>;

  constructor(source: EnrichSource<S>, target: EnrichTarget<T>, transformer: EnrichTransformer<S, T>) {
    this.source = source;
    this.target = target;
    this.transformer = transformer;
  }

  /**
   * Extract phase.
   * @param items List of identifiers.
   * @returns List of raw items.
   */
  e(items: string[]): Promise<S[]> {
    return this.source.load(items);
  }

  /**
   * Transform phase.
   * @param items Raw items.
   * @returns Well-formed items.
   */
  t(items: S[]): Promise<T[]> {
    return this.transformer.transform(items);
  }

  /**
   * Load phase.
   * @param items Well-formed items.
   */
  l(items: T[]): Promise<void> {
    return this.target.load(items);
  }
}
