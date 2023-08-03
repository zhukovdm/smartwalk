import { v4 as uuidv4 } from "uuid";
import { UiPlace, WgsPoint } from '../domain/types';

/**
 * Constructs human-readable GPS representation of a point.
 */
export function point2text(point: WgsPoint): string {
  const prec = 6;
  return `${point.lat.toFixed(prec)}N, ${point.lon.toFixed(prec)}E`;
}

/**
 * Convert a point to a simple place.
 */
export function point2place(point: WgsPoint): UiPlace {
  return { name: point2text(point), location: point, keywords: [], selected: [] };
}

/**
 * Generate Id based on a content of a JavaScript entity.
 */
export class IdGenerator {
  public static generateId(_: any) { return uuidv4(); }
}

/**
 * Extract supported attributes in case the server releases extended data model.
 */
export class AutocAttributes {

  private static supportedExistens = new Set([
    "image",
    "description",
    "website",
    "address",
    "payment",
    "email",
    "phone",
    "charge",
    "openingHours"
  ]);

  private static supportedBooleans = new Set([
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

  private static supportedNumerics = new Set([
    "rating",
    "capacity",
    "minimumAge"
  ]);

  private static supportedTextuals = new Set([
    "name"
  ]);

  private static supportedCollects = new Set([
    "rental",
    "clothes",
    "cuisine"
  ]);

  private static set2list(s: Set<string>): string[] { return [...Array.from(s)]; }

  private static union(s1: Set<string>, s2: Set<string>): Set<string> {
    return this
      .set2list(s1)
      .reduce((s, item) => { if (s2.has(item)) { s.add(item) } return s; }, new Set<string>());
  }

  public static group(attributes: string[]) {
    return {
      es: Array.from(AutocAttributes.union(AutocAttributes.supportedExistens, new Set(attributes))),
      bs: Array.from(AutocAttributes.union(AutocAttributes.supportedBooleans, new Set(attributes))),
      ns: Array.from(AutocAttributes.union(AutocAttributes.supportedNumerics, new Set(attributes))),
      ts: Array.from(AutocAttributes.union(AutocAttributes.supportedTextuals, new Set(attributes))),
      cs: Array.from(AutocAttributes.union(AutocAttributes.supportedCollects, new Set(attributes))),
    };
  }
}
