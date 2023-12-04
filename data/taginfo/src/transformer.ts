import { ValueItem } from "./types";

/** Extracted value should occur at least `COUNT_LIMIT` times. */
const COUNT_LIMIT = 50;

export default class Transformer {

  async transform(col: Map<string, number>): Promise<ValueItem[]> {
    const result = Array.from(col.keys())
      .map((key) => ({ value: key, count: col.get(key)! }))
      .sort((l, r) => r.count - l.count)
      .filter((pair) => pair.count >= COUNT_LIMIT);

    return Promise.resolve(result);
  }
}
