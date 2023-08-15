import { Place, StoredPlace, UiPlace } from "./types";

export function getCopyKnownGrains(places: StoredPlace[]): Map<string, StoredPlace> {
  return places
    .filter((place) => !!place.smartId)
    .map((place) => structuredClone(place))
    .reduce((map, place) => map.set(place.smartId, place), new Map<string, StoredPlace>());
}

export function getSatConditions(places: Place[]): Set<string> {
  return places.reduce((set, place) => {
    place.categories.forEach((keyword) => { set.add(keyword) });
    return set;
  }, new Set<string>());
}

export function replaceName({smartId: grainId, name, ...rest}: UiPlace, grains: Map<string, StoredPlace>): UiPlace {
  const n = grainId ? (grains.get(grainId)?.name ?? name) : name;
  return { ...rest, smartId: grainId, name: n };
}

export function camelCaseToKeyword(token: string): string {
  const res = [];
  for (const l of token) {
    res.push((l === l.toLowerCase()) ? l : ` ${l.toLowerCase()}`);
  }
  return res.join('');
}
