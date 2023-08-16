import { Place, StoredPlace, UiPlace } from "./types";

export function getCopyStoredPlaces(places: StoredPlace[]): Map<string, StoredPlace> {
  return places
    .filter((place) => !!place.smartId)
    .map((place) => structuredClone(place))
    .reduce((map, place) => map.set(place.smartId!, place), new Map<string, StoredPlace>());
}

export function getSatConditions(places: Place[]): Set<number> {
  return places
    .map((p) => p.categories).flat()
    .reduce((set, cat) => set.add(cat), new Set<number>());
}

export function replaceName({ smartId, name, ...rest }: UiPlace, places: Map<string, StoredPlace>): UiPlace {
  const n = smartId ? (places.get(smartId)?.name ?? name) : name;
  return { ...rest, smartId: smartId, name: n };
}

export function camelCaseToKeyword(token: string): string {
  const res = [];
  for (const l of token) {
    res.push((l === l.toLowerCase()) ? l : ` ${l.toLowerCase()}`);
  }
  return res.join("");
}
