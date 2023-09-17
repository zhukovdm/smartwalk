import {
  attributeFilterBooleanLabels,
  attributeFilterCollectLabels,
  attributeFilterExistenLabels,
  attributeFilterNumericLabels,
  attributeFilterTextualLabels
} from "../domain/types";

/**
 * Extract supported attributes in case the server releases extended data model.
 */
export default class AttributeGrouper {

  private static supportedEs = new Set(attributeFilterExistenLabels);
  private static supportedBs = new Set(attributeFilterBooleanLabels);
  private static supportedNs = new Set(attributeFilterNumericLabels);
  private static supportedTs = new Set(attributeFilterTextualLabels);
  private static supportedCs = new Set(attributeFilterCollectLabels);

  private static union<T>(s1: Set<T & string>, s2: Set<string>) {
    return Array.from(s1).reduce((s, item) => (
      s2.has(item) ? s.add(item) : s), new Set<T & string>());
  }

  public static group(attributes: string[]) {
    return {
      es: Array.from(this.union(this.supportedEs, new Set(attributes))),
      bs: Array.from(this.union(this.supportedBs, new Set(attributes))),
      ns: Array.from(this.union(this.supportedNs, new Set(attributes))),
      ts: Array.from(this.union(this.supportedTs, new Set(attributes))),
      cs: Array.from(this.union(this.supportedCs, new Set(attributes))),
    };
  }
}
