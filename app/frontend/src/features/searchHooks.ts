import { useContext, useEffect, useState } from "react";
import { IMap } from "../domain/interfaces";
import { KeywordAdviceItem, UiPlace } from "../domain/types";
import { point2place } from "../utils/functions";
import SmartWalkFetcher from "../utils/smartwalk";
import { AppContext } from "../App";
import { updateSearchDirecsPlace } from "./searchDirecsSlice";
import { setSearchPlacesCenter } from "./searchPlacesSlice";
import {
  setSearchRoutesSource,
  setSearchRoutesTarget
} from "./searchRoutesSlice";
import { useAppDispatch } from "./storeHooks";

/**
 * Obtain keyword advice from a SmartWalk endpoint.
 */
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

    let ignore = false;

    const loadFromSmartwalkApi = async () => {
      setLoading(true);

      try {
        const items = await SmartWalkFetcher.adviceKeywords(prefix);

        if (!ignore) {
          items.forEach((item) => {
            const {
              capacity,
              minimumAge,
              rating,
              year
            } = item.numericBounds;
  
            if (!!capacity) {
              capacity.min = Math.max(capacity.min, 0);
              capacity.max = Math.min(capacity.max, 300);
            }
  
            if (!!minimumAge) {
              minimumAge.min = Math.max(minimumAge.min, 0);
              minimumAge.max = Math.min(minimumAge.max, 150);
            }
  
            if (!!rating) {
              rating.min = Math.max(rating.min, 0);
              rating.max = Math.min(rating.max, 5);
            }
  
            if (!!year) {
              year.max = Math.min(year.max, new Date().getFullYear());
            }
          });
  
          if (items.length > 0) {
            setOptions(items);
            adviceKeywords.set(prefix, items);
          }
        }
      }
      catch (ex) { alert(ex); }
      finally {
        if (!ignore) { setLoading(false); }
      }
    };

    loadFromSmartwalkApi();
    return () => { ignore = true; };
  }, [input, value, adviceKeywords]);

  return { loading, options };
}

/**
 * Prepare map with search direcs sequence (search direcs).
 */
export function useSearchDirecsMap(waypoints: [UiPlace, boolean][]): void {

  const dispatch = useAppDispatch();
  const { map } = useContext(AppContext);

  useEffect(() => {
    map?.clear();
    waypoints.forEach(([w, s], i) => {
      (s)
        ? map?.addStored(w, [])
        : map?.addCommon(w, [], !w.smartId).withDrag((pt) => { dispatch(updateSearchDirecsPlace({ place: point2place(pt), index: i})); });
    });
  }, [map, dispatch, waypoints]);
}

/**
 * Prepare map with center and circle (search places).
 */
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

/**
 * Prepare map with source and target (search routes).
 */
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
