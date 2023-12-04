import { ValueItem } from "./types.js";
import Source from "./source.js";
import Target from "./target.js";
import Transformer from "./transformer.js";

export default class Pipeline {

  private readonly source: Source;
  private readonly target: Target;
  private readonly transformer: Transformer;

  constructor(source: Source, target: Target) {
    this.source = source;
    this.target = target;
    this.transformer = new Transformer();
  }

  /**
   * Extract phase.
   * @param key concrete OSM key.
   */
  e(key: string): Promise<Map<string, number>> {
    return this.source.load(key);
  }

  /**
   * Transform phase. Prepare for write to file. Note that Map does not
   * maintain lexicographic order!
   * @param col collection of elements.
   */
  async t(col: Map<string, number>): Promise<ValueItem[]> {
    return this.transformer.transform(col);
  }

  /**
   * Load phase.
   * @param key File name.
   * @param list Items assiciated with the key.
   */
  l(key: string, list: ValueItem[]): Promise<void> {
    return this.target.load(key, list);
  }
}
