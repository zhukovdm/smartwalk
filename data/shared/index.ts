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
  return `${date.getFullYear()}-${paddedWithZeros(date.getMonth())}-${paddedWithZeros(date.getDate())} ${paddedWithZeros(date.getHours())}:${paddedWithZeros(date.getMinutes())}:${paddedWithZeros(date.getSeconds())}`
}

/**
 * @param payload List of items.
 * @param window Number of item in one batch.
 * @returns Generator.
 */
export function getPayloadIter<T>(payload: T[], window: number): {
  [Symbol.iterator](): Generator<T[], void, unknown>;
} {
  return {
    *[Symbol.iterator]() {
      while (payload.length > 0) {
        yield payload.slice(0, window);
        payload = payload.slice(window);
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
