import { useContext, useEffect, useState } from "react";
import { AppContext } from "../App";
import { KeywordAdviceItem, UiPlace } from "../domain/types";
import { IMap } from "../domain/interfaces";
import { point2place } from "../utils/helpers";
import { SmartWalkFetcher } from "../utils/smartwalk";
import { setBounds } from "./panelSlice";
import { updateSearchDirecsPlace } from "./searchDirecsSlice";
import { setSearchPlacesCenter } from "./searchPlacesSlice";
import {
  setSearchRoutesSource,
  setSearchRoutesTarget
} from "./searchRoutesSlice";
import { useAppDispatch, useAppSelector } from "./storeHooks";

export function useSearchBoundsAdvice(): void {

  const dispatch = useAppDispatch();
  const { bounds } = useAppSelector((state) => state.panel);

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      try {
        if (!bounds) {
          const obj = await SmartWalkFetcher.adviceBounds();
          if (obj) {
            obj.capacity.min = Math.max(obj.capacity.min, 0);
            obj.capacity.max = Math.min(obj.capacity.max, 500);
  
            obj.minimumAge.min = Math.max(obj.minimumAge.min, 0);
            obj.minimumAge.max = Math.min(obj.minimumAge.max, 150);
  
            obj.rating.min = Math.max(obj.rating.min, 0);
            obj.rating.max = Math.min(obj.rating.max, 5);
  
            obj.year.max = Math.min(
              obj.year.max, new Date().getFullYear());
  
            if (!ignore) {
              dispatch(setBounds(obj));
            }
          }
        }
      }
      catch (ex) { alert(ex); }
    };

    load();
    return () => { ignore = true; };
  }, [dispatch, bounds]);
}

export function useSearchKeywordsAdvice(
  input: string, value: KeywordAdviceItem | null): { loading: boolean; options: KeywordAdviceItem[] } {

  const { adviceKeywords } = useContext(AppContext).smart;

  const [loading, setLoading] = useState<boolean>(false);
  const [options, setOptions] = useState<KeywordAdviceItem[]>([]);

  useEffect(() => {
    const prefix = input.toLocaleLowerCase();
    if (prefix.length === 0) { setOptions(value ? [value] : []); return; }

    const cached = adviceKeywords.get(prefix);
    if (cached) { setOptions(cached); return; }

    const load = async () => {
      setLoading(true);
      try {
        const items = await SmartWalkFetcher.adviceKeywords(prefix);
        if (items.length > 0) {
          adviceKeywords.set(prefix, items);
          setOptions(items);
        }
      }
      catch (ex) { alert(ex); }
      finally {
        setLoading(false);
      }
    };

    load();
  }, [input, value, adviceKeywords]);

  return { loading, options };
}

export function useSearchDirecsMap(waypoints: UiPlace[]): void {

  const dispatch = useAppDispatch();
  const { map } = useContext(AppContext);

  useEffect(() => {
    map?.clear();
    waypoints.forEach((waypoint, i) => {
      (!!waypoint.placeId)
        ? map?.addStored(waypoint, [])
        : map?.addCommon(waypoint, [], true).withDrag((pt) => { dispatch(updateSearchDirecsPlace({ place: point2place(pt), index: i})); });
    });
  }, [map, dispatch, waypoints]);
}

export function useSearchPlacesMap(center: UiPlace | undefined, radius: number): IMap | undefined {

  const dispatch = useAppDispatch();
  const { map } = useContext(AppContext);

  useEffect(() => {
    map?.clear();
    const meters = radius * 1000.0;

    if (center) {
      (center.placeId)
        ? map?.addCenter(center, [], false)
        : map?.addCenter(center, [], true).withDrag(pt => dispatch(setSearchPlacesCenter(point2place(pt)))).withCirc(map, meters);

      map?.drawCircle(center.location, meters);
    }
  }, [map, dispatch, center, radius]);

  return map;
}

export function useSearchRoutesMap(source: UiPlace | undefined, target: UiPlace | undefined): IMap | undefined {

  const dispatch = useAppDispatch();
  const { map } = useContext(AppContext);

  useEffect(() => {
    map?.clear();

    if (source) {
      (source.placeId)
        ? map?.addSource(source, [], false)
        : map?.addSource(source, [], true).withDrag(pt => dispatch(setSearchRoutesSource(point2place(pt))));
    }

    if (target) {
      (target.placeId)
        ? map?.addTarget(target, [], false)
        : map?.addTarget(target, [], true).withDrag(pt => dispatch(setSearchRoutesTarget(point2place(pt))));
    }
  }, [map, dispatch, source, target]);

  return map;
}
