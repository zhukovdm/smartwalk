import { useMemo } from "react";
import { StoredPlace, UiPlace } from "../domain/types";
import { useAppSelector } from "./storeHooks";

/**
 * Detect whether a place has a familiar identifier (either placeId or smartId).
 */
function isPlaceStored(place: UiPlace, storedPlaces: Map<string, UiPlace>, storedSmarts: Map<string, UiPlace>): boolean {
  const pid = place.placeId;
  const sid = place.smartId;
  return (!!pid && storedPlaces.has(pid)) || (!!sid && storedSmarts.has(sid));
}

/**
 * @param getId Id extractor
 * @returns collection of places with key set to an Id
 */
function useFavoritePlaces(getId: (place: StoredPlace) => string | undefined): Map<string, StoredPlace> {
  const { places: favoritePlaces } = useAppSelector((state) => state.favorites);
  return useMemo(() => (
    favoritePlaces
      .filter((place) => !!getId(place))
      .reduce((acc, place) => acc.set(getId(place)!, place), new Map<string, StoredPlace>())
  ), [getId, favoritePlaces]);
}

/**
 * @returns `kv`-collection of places with keys set to `placeId`,
 * places without `placeId` are omitted (all stored have an Id).
 */
export function useStoredPlaces(): Map<string, StoredPlace> {
  return useFavoritePlaces((place: StoredPlace) => place.placeId);
}

/**
 * @returns `kv`-collection of places with keys set to `smartId`,
 * places without `smartId` are omitted.
 */
export function useStoredSmarts(): Map<string, StoredPlace> {
  return useFavoritePlaces((place: StoredPlace) => place.smartId);
}

/**
 * Update place information by the latest from the storage.
 */
function mergePlace(place: UiPlace | undefined, storedPlaces: Map<string, UiPlace>, storedSmarts: Map<string, UiPlace>): UiPlace | undefined {
  if (!place) { return place; }

  const f = (xid: string | undefined, place: UiPlace, store: Map<string, UiPlace>) => {
    return (!!xid && store.has(xid))
      ? { ...store.get(xid)!, categories: place.categories }
      : undefined;
  };

  const storedPlace = f(place.placeId, place, storedPlaces);
  const storedSmart = f(place.smartId, place, storedSmarts);

  return storedPlace ?? storedSmart ?? place;
}

/**
 * Synchronize an individual place with the current state (relevant only for
 * source, target, and center).
 * @param place place with possibly outdated data items
 * @param storedPlaces collection of places with key set to `placeId`
 * @param storedSmarts collection of places with key set to `smartId` (places
 *    without Id are omitted)
 * @returns true place representation (with proper `name` and `categories`)
 */
export function usePlace(place: UiPlace | undefined, storedPlaces: Map<string, UiPlace>, storedSmarts: Map<string, UiPlace>): UiPlace | undefined {
  return useMemo(() => (mergePlace(place, storedPlaces, storedSmarts)), [place, storedPlaces, storedSmarts]);
}

/**
 * Synchronize a list of places with the current state.
 * @param places places with possibly outdated data items
 * @param storedPlaces collection of places with key set to `placeId`
 * @param storedSmarts collection of places with key set to `smartId` (places
 *    without `smartId` are omitted)
 * @returns a tuple with true place representations (with proper `name` and
 *    `categories`) and a flag whether the place appears in the current storage.
 */
export function usePlaces(places: UiPlace[], storedPlaces: Map<string, UiPlace>, storedSmarts: Map<string, UiPlace>): [UiPlace, boolean][] {
  return useMemo(() => (
    places.map((place) => ([
      mergePlace(place, storedPlaces, storedSmarts)!,
      isPlaceStored(place, storedPlaces, storedSmarts)
    ]))
  ), [places, storedPlaces, storedSmarts]);
}
