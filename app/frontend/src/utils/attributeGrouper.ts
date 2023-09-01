/**
 * Extract supported attributes in case the server releases extended data model.
 */
export default class AttributeGrouper {

  private static supportedEs = new Set([
    "description",
    "image",
    "website",
    "address",
    "email",
    "phone",
    "socialNetworks",
    "charge",
    "openingHours"
  ]);

  private static supportedBs = new Set([
    "fee",
    "delivery",
    "drinkingWater",
    "internetAccess",
    "shower",
    "smoking",
    "takeaway",
    "toilets",
    "wheelchair"
  ]);

  private static supportedNs = new Set([
    "capacity",
    "elevation",
    "minimumAge",
    "rating",
    "year"
  ]);

  private static supportedTs = new Set([
    "name"
  ]);

  private static supportedCs = new Set([
    "clothes",
    "cuisine",
    "denomination",
    "payment",
    "rental"
  ]);

  private static union(s1: Set<string>, s2: Set<string>): Set<string> {
    return Array.from(s1)
      .reduce((s, item) => (s2.has(item) ? s.add(item) : s), new Set<string>());
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
