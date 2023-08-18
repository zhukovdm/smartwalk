import { useMemo } from "react";
import { StoredPlace, UiPlace } from "../domain/types";
import { useAppSelector } from "./store";

function useFavoritePlaces(f: (place: StoredPlace) => string | undefined): Map<string, StoredPlace> {
  const { places: favoritePlaces } = useAppSelector((state) => state.favorites);
  return useMemo(() => (
    favoritePlaces
      .filter((place) => !!f(place))
      .reduce((acc, place) => acc.set(f(place)!, place), new Map<string, StoredPlace>())
  ), [favoritePlaces]);
}

export function useStoredPlaces(): Map<string, StoredPlace> {
  return useFavoritePlaces((place: StoredPlace) => place.placeId);
}

export function useStoredSmarts(): Map<string, StoredPlace> {
  return useFavoritePlaces((place: StoredPlace) => place.smartId);
}

function getPlace(placeId: string | undefined, smartId: string | undefined, storedPlaces: Map<string, UiPlace>, storedSmarts: Map<string, UiPlace>): UiPlace | undefined {
  return storedPlaces.get(placeId ?? "") ?? storedSmarts.get(smartId ?? "");
}

export function usePlace(place: UiPlace | undefined, storedPlaces: Map<string, UiPlace>, storedSmarts: Map<string, UiPlace>): UiPlace | undefined {
  return useMemo(() => (
    getPlace(place?.placeId, place?.smartId, storedPlaces, storedSmarts) ?? place
  ), [place, storedPlaces, storedSmarts]);
}

export function usePlaces(places: UiPlace[], storedPlaces: Map<string, UiPlace>, storedSmarts: Map<string, UiPlace>): UiPlace[] {
  return useMemo(() => (
    places.map((place) => (getPlace(place.placeId, place.smartId, storedPlaces, storedSmarts) ?? place))
  ), [places, storedPlaces, storedSmarts]);
}
