import { useContext, useEffect, useState } from "react";
import { AppContext } from "../App";
import SmartWalkFetcher from "../utils/smartwalk";

export function useSmartPlace(smartId: string) {

  const { entityPlaces } = useContext(AppContext).smart;

  const [pload, setPload] = useState(false);
  const [place, setPlace] = useState(entityPlaces.get(smartId));

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      try {
        if (!place && !pload) {
          const p = await SmartWalkFetcher.entityPlaces(smartId);
          if (!ignore && p) {
            setPlace(p);
            entityPlaces.set(smartId, p);
          }
        }
      }
      catch (ex) { alert(ex); }
      finally {
        if (!ignore) { setPload(true); }
      }
    };

    load();
    return () => { ignore = true; }
  }, [smartId, entityPlaces, place, pload]);

  return { place: place, placeLoaded: pload };
}
