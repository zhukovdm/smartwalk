import { useContext, useEffect, useMemo } from "react";
import { AppContext } from "../App";
import { IMap } from "../domain/interfaces";
import type { Path, UiPlace, UiRoute } from "../domain/types";
import {
  usePlace,
  usePlaces,
  useStoredPlaces,
  useStoredSmarts
} from "./sharedHooks";
import { useAppSelector } from "./storeHooks";

/**
 * Draw given places and path specific for direcs result (without `flyTo`).
 */
export function useResultDirecsMap(waypoints: [UiPlace, boolean][], path: Path): IMap | undefined {

  const { map } = useContext(AppContext);

  useEffect(() => {
    map?.clear();
    waypoints.forEach(([w, s]) => {
      (s)
        ? map?.addStored(w, [])
        : map?.addCommon(w, [], false);
    });
    map?.drawPolyline(path.polyline);
  }, [map, path, waypoints]);

  return map;
}

/**
 * Construct map, and true place representations for a given route and current
 * state of the storage. The list of places is filtered according to the filter
 * list (checkboxes (un-)set by the user).
 */
export function useResultRoute(route: UiRoute) {

  const {
    path,
    categories,
    source: routeSource,
    target: routeTarget,
    places: routePlaces,
    waypoints: routeWaypoints
  } = route;

  const { map } = useContext(AppContext);
  const { routeFilters: filterList } = useAppSelector((state) => state.viewer);

  const storedPlaces = useStoredPlaces();
  const storedSmarts = useStoredSmarts();

  const source = usePlace(routeSource, storedPlaces, storedSmarts)!;
  const target = usePlace(routeTarget, storedPlaces, storedSmarts)!;

  const placeLst = usePlaces(routePlaces, storedPlaces, storedSmarts)
    .filter(([p, _]) => (
      p.categories.some((c) => filterList[c])));

  const placeMap = useMemo(() => (
    placeLst.reduce((acc, [p, s]) => (acc.set(p.smartId!, [p, s])), new Map<string, [UiPlace, boolean]>())
  ), [placeLst]);

  const waypoints = useMemo(() => (
    routeWaypoints
      .filter((w) => filterList[w.category])
      .map((w) => placeMap.get(w.smartId))
      .filter((w) => !!w) as [UiPlace, boolean][]
  ), [filterList, routeWaypoints, placeMap]);

  useEffect(() => {
    map?.clear();

    placeLst.forEach(([w, s]) => {
      (s)
        ? map?.addStored(w, categories)
        : map?.addCommon(w, categories, false);
    });

    map?.addSource(source, [], false);
    map?.addTarget(target, [], false);
    map?.drawPolyline(path.polyline);
  }, [map, source, target, path, placeLst, categories]);

  return { map: map, source: source, target: target, waypoints: waypoints, filterList: filterList };
};
