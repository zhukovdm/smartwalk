import Logger from "./logger.js";

export default class Transformer {
  
  private processedTot = 0;
  private processedCur = 0;
  private readonly logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  private static getBaseItem(keyword: string): Item {
    return {
      keyword: keyword,
      count: 0,
      attributeList: new Set<string>().add("name"), // non-empty!
      numericBounds: {},
      collectBounds: {}
    };
  }

  reduce(place: Place, keywords: Map<string, Item>): void {
    place.keywords.forEach((keyword) => {

      if (!keywords.has(keyword)) {
        keywords.set(keyword, Transformer.getBaseItem(keyword));
      }
  
      const item = keywords.get(keyword)!;
      const numerics = item.numericBounds;
      const collects = item.collectBounds;
  
      // count
  
      ++item.count;
  
      // attributes
  
      Object.keys(place.attributes).forEach((key) => {
        item.attributeList.add(key);
      });
  
      // numerics
  
      (["capacity", "elevation", "minimumAge", "rating", "year"] as NumericBoundLabel[]).forEach((label) => {
        const num = place.attributes[label];
  
        if (num !== undefined) {
          const numeric = numerics[label] ?? {
            min: Number.MAX_VALUE,
            max: Number.MIN_VALUE
          };
          numeric.min = Math.round(Math.min(numeric.min, num));
          numeric.max = Math.round(Math.max(numeric.max, num));
          numerics[label] = numeric;
        }
      });
  
      // collects
  
      (["clothes", "cuisine", "denomination", "payment", "rental"] as CollectBoundLabel[]).forEach((label) => {
        const col = place.attributes[label];
  
        if (col !== undefined) {
          const collect = collects[label] ?? new Set<string>();
          col.forEach((atom: string) => { collect.add(atom); });
          collects[label] = collect;
        }
      });
    });

    if (++this.processedCur >= 10000) {
      this.processedTot += this.processedCur;
      this.logger.logProcessedCur(this.processedTot);
      this.processedCur = 0;
    }
  }

  reportProcessedTot() {
    this.logger.logProcessedTot(this.processedTot + this.processedCur);
  }
}
