import { ENTITY_PLACES_ADDR } from './routing';
import { UiPlace, WgsPoint } from '../domain/types';

const LOCATION_PRECISION = 7;

/**
 * Create a copy of an array with deleted item on a certain index.
 */
export function deleteItemImmutable<T>(arr: T[], i: number) {
  return [...arr.slice(0, i), ...arr.slice(i + 1)];
}

/**
 * Create a copy of an array with replaced item on a certain index.
 */
export function updateItemImmutable<T>(arr: T[], item: T, i: number): T[] {
  return [...arr.slice(0, i), item, ...arr.slice(i + 1)];
}

/**
 * Create a copy of an array with item moved from position `fr` to position `to`.
 */
export function fromToItemImmutable<T>(arr: T[], fr: number, to: number): T[] {
  const res = Array.from(arr);
  const [e] = res.splice(fr, 1);
  res.splice(to, 0, e);

  return res;
}

/**
 * Present the content safely.
 * - https://stackoverflow.com/a/4835406
 */
export function escapeHtml(text: string): string {
  const map = new Map<string, string>([
    ["&", "&amp;"], ["<", "&lt;"], [">", "&gt;"], ["\"", "&quot;"], ["'", "&#039;"]
  ]);
  return text.replace(/[&<>"']/g, (m) => { return map.get(m)!; });
}

/**
 * Convert `aB...` to `a b...`
 */
export function camelCaseToLabel(token: string): string {
  const res = [];
  for (const ch of token) {
    res.push((ch === ch.toLowerCase()) ? ch : ` ${ch.toLowerCase()}`);
  }
  return res.join("");
}

/**
 * Constructs human-readable GPS representation of a point. Note that
 * `-1.0N -1.0E` is a valid representation.
 */
export function point2text(point: WgsPoint): string {
  return `${point.lat.toFixed(6)}N, ${point.lon.toFixed(6)}E`;
}

/**
 * Convert a point to a simple place (without keywords and categories).
 */
export function point2place(point: WgsPoint): UiPlace {
  const location = {
    lon: parseFloat(point.lon.toFixed(LOCATION_PRECISION)),
    lat: parseFloat(point.lat.toFixed(LOCATION_PRECISION))
  };
  return { name: point2text(location), location: location, keywords: [], categories: [] };
}

/**
 * @returns Category identifiers satisfied by the set of places
 */
export function getSatCategories(places: UiPlace[]): Set<number> {
  return places
    .map((place) => place.categories).flat()
    .reduce((acc, cat) => acc.add(cat), new Set<number>());
}

/**
 * Construct url for a Smart place.
 */
export function getSmartPlaceLink(smartId: string | undefined): string | undefined {
  return (!!smartId) ? `${ENTITY_PLACES_ADDR}/${smartId}` : undefined;
}
