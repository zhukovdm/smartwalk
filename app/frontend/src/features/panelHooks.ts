import { useContext, useEffect } from "react";
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
  setFavoritesLoaded,
  setFavoritesLoadedRatio
} from "./favoritesSlice";

/**
 * Load the entire collection of Favorites from the current storage to the
 * application state.
 */
export function useFavorites(): void {

  const { storage } = useContext(AppContext);

  const dispatch = useAppDispatch();
  const {
    loaded: favoritesLoaded
  } = useAppSelector((state) => state.favorites);

  useEffect(() => {
    let ignore = false;

    const loadEntitiesFromStorage = async () => {
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
              dispatch(setFavoritesLoadedRatio((++cur) / tot));
            }
          }

          for (const pid of pids) {
            const place = await storage.getPlace(pid);
            if (place) {
              places.push(place);
            }
            if (!ignore) {
              dispatch(setFavoritesLoadedRatio((++cur) / tot));
            }
          }

          for (const rid of rids) {
            const route = await storage.getRoute(rid);
            if (route) {
              routes.push(route);
            }
            if (!ignore) {
              dispatch(setFavoritesLoadedRatio((++cur) / tot));
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

    loadEntitiesFromStorage();
    return () => { ignore = true; };
  }, [storage, dispatch, favoritesLoaded]);
}
