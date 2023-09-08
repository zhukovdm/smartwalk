import {
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { AppContext } from "../App";
import SmartWalkFetcher from "../utils/smartwalk";
import { ExtendedPlace } from "../domain/types";
import { useAppSelector } from "./storeHooks";

/**
 * Fetch extended place from the server by `smartId`.
 */
export function useSmartPlace(smartId: string) {

  const { entityPlaces } = useContext(AppContext).smart;

  const [loaded, setLoaded] = useState(false);
  const [place, setPlace] = useState(entityPlaces.get(smartId));

  useEffect(() => {
    let ignore = false;

    const loadFromServer = async () => {
      try {
        if (!place && !loaded) {
          const p = await SmartWalkFetcher.entityPlaces(smartId);
          if (!ignore && p) {
            setPlace(p);
            entityPlaces.set(smartId, p);
          }
        }
      }
      catch (ex) { alert(ex); }
      finally {
        if (!ignore) { setLoaded(true); }
      }
    };

    loadFromServer();
    return () => { ignore = true; }
  }, [smartId, entityPlaces, place, loaded]);

  return { place: place, placeLoaded: loaded };
}

/**
 * Draw map primitives for an extended place.
 */
export function useExtendedPlace(place: ExtendedPlace) {

  const { polygon } = place.attributes;

  const { map, storage } = useContext(AppContext);
  const { places } = useAppSelector((state) => state.favorites);

  const storedPlace = useMemo(() => (
    places.find((p) => p.smartId === place.smartId)), [place, places]);
  
  useEffect(() => {
    map?.clear();
    (!!storedPlace)
      ? map?.addStored(place, [])
      : map?.addCommon(place, [], false);
    if (polygon) {
      map?.drawPolygon(polygon);
    }
    map?.flyTo(place);
  }, [map, place, storedPlace, polygon]);

  return { map: map, storage: storage, storedPlace: storedPlace };
}
