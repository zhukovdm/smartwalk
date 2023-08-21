import { useMemo } from "react";
import { StoredPlace, UiPlace } from "../domain/types";
import { useAppSelector } from "./storeHooks";

function useFavoritePlaces(f: (place: StoredPlace) => string | undefined): Map<string, StoredPlace> {
  const { places: favoritePlaces } = useAppSelector((state) => state.favorites);
  return useMemo(() => (
    favoritePlaces
      .filter((place) => !!f(place))
      .reduce((acc, place) => acc.set(f(place)!, place), new Map<string, StoredPlace>())
  ), [f, favoritePlaces]);
}

export function useStoredPlaces(): Map<string, StoredPlace> {
  return useFavoritePlaces((place: StoredPlace) => place.placeId);
}

export function useStoredSmarts(): Map<string, StoredPlace> {
  return useFavoritePlaces((place: StoredPlace) => place.smartId);
}

/**
 * @returns True place representation (with proper `name` and `categories`).
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

export function usePlace(place: UiPlace | undefined, storedPlaces: Map<string, UiPlace>, storedSmarts: Map<string, UiPlace>): UiPlace | undefined {
  return useMemo(() => (mergePlace(place, storedPlaces, storedSmarts)), [place, storedPlaces, storedSmarts]);
}

export function usePlaces(places: UiPlace[], storedPlaces: Map<string, UiPlace>, storedSmarts: Map<string, UiPlace>): UiPlace[] {
  return useMemo(() => (
    places.map((place) => (mergePlace(place, storedPlaces, storedSmarts)!))
  ), [places, storedPlaces, storedSmarts]);
}
