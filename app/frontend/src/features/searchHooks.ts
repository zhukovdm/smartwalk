import { useContext, useEffect, useState } from "react";
import { debounce } from "@mui/material";
import { Map as IMap } from "../domain/interfaces";
import { KeywordAdviceItem, UiPlace } from "../domain/types";
import { point2place } from "../utils/functions";
import { fetchAdviceKeywords } from "../utils/smartwalk";
import { fetchSearchPoints } from "../utils/nominatim";
import { AppContext } from "../App";
import { updateSearchDirecsPlace } from "./searchDirecsSlice";
import { setSearchPlacesCenter } from "./searchPlacesSlice";
import {
  setSearchRoutesSource,
  setSearchRoutesTarget
} from "./searchRoutesSlice";
import { useAppDispatch } from "./storeHooks";

const DEBOUNCE_DELAY: number = 1000.0;

/**
 * Obtain keyword advice.
 */
export function useKeywordAdvice(
  input: string, value: KeywordAdviceItem | null): { loading: boolean; options: KeywordAdviceItem[] } {

  const { adviceKeywords } = useContext(AppContext).cache;

  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<KeywordAdviceItem[]>([]);

  const updateState = (loading: boolean, options: KeywordAdviceItem[]): void => {
    setLoading(loading);
    setOptions(options);
  };

  useEffect(() => {
    const normalizedInput = input.toLocaleLowerCase();
    if (normalizedInput.length === 0) {
      updateState(false, !!value ? [value] : []);
      return;
    }

    const cached = adviceKeywords.get(normalizedInput);
    if (!!cached) {
      updateState(false, cached);
      return;
    }

    let ignore = false;

    const loadFromApi = async () => {

      if (!ignore) { setLoading(true); }

      try {
        const items = await fetchAdviceKeywords(normalizedInput);

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
            adviceKeywords.set(normalizedInput, items);
          }
        }
      }
      catch (ex) { alert(ex); }
      finally {
        if (!ignore) { setLoading(false); }
      }
    };

    const debounced = debounce(loadFromApi, DEBOUNCE_DELAY);
    debounced();

    return () => { ignore = true; debounced.clear(); };
  }, [input, value, adviceKeywords]);

  return { loading, options };
}

/**
 * Obtain points by free-form input text.
 */
export function useSearchedPoints(input: string, value: UiPlace | null) {

  const { searchedPlaces } = useContext(AppContext).cache;

  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<UiPlace[]>([]);

  const updateState = (loading: boolean, options: UiPlace[]): void => {
    setLoading(loading);
    setOptions(options);
  }

  useEffect(() => {
    const normalizedInput = input.toLocaleLowerCase();
    if (normalizedInput.length === 0) {
      updateState(false, !!value ? [value] : []);
      return;
    }

    const cached = searchedPlaces.get(normalizedInput);
    if (!!cached) {
      updateState(false, cached);
      return;
    }

    if (!!value && normalizedInput === value.name.toLocaleLowerCase()) {
      updateState(false, [value]);
      searchedPlaces.set(normalizedInput, [value]);
      return;
    }

    let ignore = false;

    const loadFromApi = async () => {

      if (!ignore) { setLoading(true); }

      try {
        const items = await fetchSearchPoints(normalizedInput);

        if (items.length > 0) {
          setOptions(items);
          searchedPlaces.set(normalizedInput, items);
        }
      }
      catch (ex) { alert(ex); }
      finally {
        if (!ignore) { setLoading(false); }
      }
    }

    const debounced = debounce(loadFromApi, DEBOUNCE_DELAY);
    debounced();

    return () => { ignore = true; debounced.clear(); };
  }, [input, value, searchedPlaces]);

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
