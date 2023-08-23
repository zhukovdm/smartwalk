import { useContext, useEffect, useMemo } from "react";
import { AppContext } from "../App";
import { IMap } from "../domain/interfaces";
import { Path, UiPlace, UiRoute } from "../domain/types";
import {
  usePlace,
  usePlaces,
  useStoredPlaces,
  useStoredSmarts
} from "./sharedHooks";

export function useResultDirecsMap(places: UiPlace[], path: Path): IMap | undefined {

  const { map } = useContext(AppContext);

  useEffect(() => {
    map?.clear();
    places.forEach((place) => {
      (!!place.placeId)
        ? map?.addStored(place, [])
        : map?.addCommon(place, [], false);
    });
    map?.drawPolyline(path.polyline);
  }, [map, path, places]);

  return map;
}

export function useResultRoute(route: UiRoute, filterList: boolean[]) {

  const {
    path,
    categories,
    source: routeSource,
    target: routeTarget,
    places: routePlaces,
    waypoints
  } = route;

  const { map } = useContext(AppContext);

  const storedPlaces = useStoredPlaces();
  const storedSmarts = useStoredSmarts();

  const source = usePlace(routeSource, storedPlaces, new Map())!;
  const target = usePlace(routeTarget, storedPlaces, new Map())!;

  const placesLst = usePlaces(routePlaces, new Map(), storedSmarts)
    .filter((place) => (
      place.categories.some((c) => filterList[c])));

  const placesMap = useMemo(() => (
    placesLst.reduce((acc, place) => (acc.set(place.smartId!, place)), new Map<string, UiPlace>())
  ), [placesLst]);

  const places = useMemo(() => (
    waypoints
      .filter((waypoint) => filterList[waypoint.category])
      .map((waypoint) => placesMap.get(waypoint.smartId))
      .filter((place) => !!place) as UiPlace[]
  ), [filterList, waypoints, placesMap]);

  useEffect(() => {
    map?.clear();

    placesLst.forEach((place) => {
      (!!place.placeId)
        ? map?.addStored(place, categories)
        : map?.addCommon(place, categories, false);
    });

    map?.addSource(source, [], false);
    map?.addTarget(target, [], false);
    map?.drawPolyline(path.polyline);
  }, [map, source, target, path, placesLst, categories]);

  return { map: map, source: source, target: target, places: places };
};
