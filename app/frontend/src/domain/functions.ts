import { UiPlace } from "./types";
import { ENTITY_PLACES_ADDR } from "./routing";

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

export function getSatCategories(places: UiPlace[]): Set<number> {
  return places
    .map((place) => place.categories).flat()
    .reduce((acc, cat) => acc.add(cat), new Set<number>());
}

export function isPlaceStored(place: UiPlace, storedPlaces: Map<string, UiPlace>, storedSmarts: Map<string, UiPlace>): boolean {
  const pid = place.placeId;
  const sid = place.smartId;
  return (!!pid && storedPlaces.has(pid)) || (!!sid && storedSmarts.has(sid));
}

export function getSmartPlaceLink(smartId: string | undefined): string | undefined {
  return (!!smartId) ? `${ENTITY_PLACES_ADDR}/${smartId}` : undefined;
}
