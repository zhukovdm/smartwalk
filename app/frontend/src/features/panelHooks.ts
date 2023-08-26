import { useContext, useEffect, useState } from "react";
import { AppContext } from "../App";
import {
  StoredDirec,
  StoredPlace,
  StoredRoute
} from "../domain/types";
import {
  useAppDispatch,
  useAppSelector
} from "./storeHooks";
import {
  setFavoriteDirecs,
  setFavoritePlaces,
  setFavoriteRoutes,
  setFavoritesLoaded
} from "./favoritesSlice";

/**
 * Load the entire collection of Favorites from the current storage to the
 * application state.
 */
export function useFavorites() {

  const { storage } = useContext(AppContext);

  const dispatch = useAppDispatch();
  const {
    loaded: favoritesLoaded
  } = useAppSelector((state) => state.favorites);

  const [loadedRatio, setLoadedRatio] = useState(0);

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      if (!ignore && !favoritesLoaded) {
        try {
          await storage.init();

          const direcs: StoredDirec[] = [];
          const places: StoredPlace[] = [];
          const routes: StoredRoute[] = [];

          const dids = await storage.getDirecIdentifiers();
          const pids = await storage.getPlaceIdentifiers();
          const rids = await storage.getRouteIdentifiers();

          let cur = 0;
          const tot = dids.length + pids.length + rids.length;

          for (const did of dids) {
            const direc = await storage.getDirec(did);
            if (direc) {
              direcs.push(direc);
            };
            if (!ignore) {
              setLoadedRatio((++cur) / tot);
            }
          }

          for (const pid of pids) {
            const place = await storage.getPlace(pid);
            if (place) {
              places.push(place);
            }
            if (!ignore) {
              setLoadedRatio((++cur) / tot);
            }
          }

          for (const rid of rids) {
            const route = await storage.getRoute(rid);
            if (route) {
              routes.push(route);
            }
            if (!ignore) {
              setLoadedRatio((++cur) / tot);
            }
          }

          if (!ignore) {
            dispatch(setFavoritesLoaded());
            dispatch(setFavoriteDirecs(direcs));
            dispatch(setFavoritePlaces(places));
            dispatch(setFavoriteRoutes(routes));
          }
        }
        catch (ex) { alert(ex); }
      }
    };

    load();
    return () => { ignore = true; };
  }, [storage, dispatch, favoritesLoaded]);

  return loadedRatio;
}
