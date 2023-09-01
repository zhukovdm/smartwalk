import { ENTITY_PLACES_ADDR } from '../domain/routing';
import { UiPlace, WgsPoint } from '../domain/types';

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
 * Convert `aB` to `a b`.
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
  return `${point.lat}N, ${point.lon}E`;
}

/**
 * Convert a point to a simple place.
 */
export function point2place(point: WgsPoint): UiPlace {
  const location = {
    lon: parseFloat(point.lon.toFixed(7)),
    lat: parseFloat(point.lat.toFixed(7))
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
 * Detect whether a place has a familiar identifier (either placeId or smartId).
 */
export function isPlaceStored(place: UiPlace, storedPlaces: Map<string, UiPlace>, storedSmarts: Map<string, UiPlace>): boolean {
  const pid = place.placeId;
  const sid = place.smartId;
  return (!!pid && storedPlaces.has(pid)) || (!!sid && storedSmarts.has(sid));
}

/**
 * Construct url for a Smart place.
 */
export function getSmartPlaceLink(smartId: string | undefined): string | undefined {
  return (!!smartId) ? `${ENTITY_PLACES_ADDR}/${smartId}` : undefined;
}
