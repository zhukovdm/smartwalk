import Source from "./source.js";
import Target from "./target.js";
import Transformer from "./transformer.js";

export default class Pipeline {

  private readonly source: Source;
  private readonly target: Target;
  private readonly transformer = new Transformer();

  constructor(source: Source, target: Target) {
    this.source = source;
    this.target = target;
  }

  /**
   * Extract phase.
   * @param bbox Bounding box.
   * @param rows Divide Bbox into N rows.
   * @param cols Divide Bbox into N cols.
   * @returns Raw items.
   */
  e(bbox: Bbox, rows: number, cols: number): Promise<any[]> {
    return this.source.load(bbox, rows, cols);
  }

  /**
   * Transform raw items into typed Items.
   * @param items Raw items.
   * @returns Items ready to be loaded.
   */
  async t(items: any[]): Promise<Item[]> {
    return this.transformer.transform(items);
  }

  /**
   * Load phase.
   * @param items Items to be loaded.
   */
  l(items: Item[]): Promise<void> {
    return this.target.load(items);
  }
}
