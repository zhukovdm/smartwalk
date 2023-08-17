import { useContext, useEffect, useState } from "react";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { Menu } from "@mui/icons-material";
import { Box, Drawer, Fab, useMediaQuery } from "@mui/material";
import { AppContext } from "../App";
import {
  StoredDirec,
  StoredPlace,
  StoredRoute
} from "../domain/types";
import {
  ENTITY_PLACES_ADDR,
  FAVORITES_ADDR,
  HOME_ADDR,
  RESULT_DIRECS_ADDR,
  RESULT_PLACES_ADDR,
  RESULT_ROUTES_ADDR,
  SEARCH_DIRECS_ADDR,
  SEARCH_PLACES_ADDR,
  SEARCH_ROUTES_ADDR,
  SESSION_SOLID_ADDR,
} from "../domain/routing";
import { showPanel } from "../features/panelSlice";
import { useAppDispatch, useAppSelector } from "../features/store";
import {
  setFavoriteDirecs,
  setFavoritePlaces,
  setFavoriteRoutes,
  setFavoritesLoaded
} from "../features/favoritesSlice";
import EntityPlacePanel from "./EntityPlacePanel";
import NotFoundPanel from "./NotFoundPanel";
import SearchDirecsPanel from "./SearchDirecsPanel";
import SearchPlacesPanel from "./SearchPlacesPanel";
import SearchRoutesPanel from "./SearchRoutesPanel";
import ResultDirecsPanel from "./ResultDirecsPanel";
import ResultPlacesPanel from "./ResultPlacesPanel";
import ResultRoutesPanel from "./ResultRoutesPanel";
import FavoritesPanel from "./FavoritesPanel";
import SessionProvider from "./SessionProvider";
import SessionSolidPanel from "./SessionSolidPanel";

export default function PanelControl(): JSX.Element {

  const { storage } = useContext(AppContext);

  const dispatch = useAppDispatch();
  const { show } = useAppSelector(state => state.panel);
  const { loaded } = useAppSelector((state) => state.favorites);

  const [loadedRatio, setLoadedRatio] = useState(0);

  useEffect(() => { dispatch(showPanel()); }, [dispatch]);

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      if (!loaded) {
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
            setLoadedRatio(++cur / tot);
          }

          for (const pid of pids) {
            const place = await storage.getPlace(pid);
            if (place) {
              places.push(place);
            }
            setLoadedRatio(++cur / tot);
          }

          for (const rid of rids) {
            const route = await storage.getRoute(rid);
            if (route) {
              routes.push(route);
            }
            setLoadedRatio(++cur / tot);
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
  }, [storage, dispatch, loaded]);

  const width = useMediaQuery("(max-width: 500px)") ? "100%" : "400px";

  return (
    <HashRouter>
      <Box sx={{ position: "absolute", top: "10px", left: "10px" }}>
        <Fab
          color={"primary"}
          size={"small"}
          title={"Show panel"}
          onClick={() => { dispatch(showPanel()); }}
        >
          <Menu />
        </Fab>
      </Box>
      <SessionProvider />
      <Drawer
        open={show}
        variant={"persistent"}
        PaperProps={{ sx: { width: width } }}
      >
        <Routes>
          <Route path={SEARCH_ROUTES_ADDR} element={<SearchRoutesPanel />} />
          <Route path={SEARCH_PLACES_ADDR} element={<SearchPlacesPanel />} />
          <Route path={SEARCH_DIRECS_ADDR} element={<SearchDirecsPanel />} />
          <Route path={RESULT_ROUTES_ADDR} element={<ResultRoutesPanel />} />
          <Route path={RESULT_PLACES_ADDR} element={<ResultPlacesPanel />} />
          <Route path={RESULT_DIRECS_ADDR} element={<ResultDirecsPanel />} />
          <Route path={SESSION_SOLID_ADDR} element={<SessionSolidPanel />} />
          <Route path={ENTITY_PLACES_ADDR + "/:id"} element={<EntityPlacePanel />} />
          <Route
            path={FAVORITES_ADDR}
            element={<FavoritesPanel loaded={loaded} loadedRatio={loadedRatio} />}
          />
          <Route path={HOME_ADDR} element={<Navigate to={SEARCH_ROUTES_ADDR} />} />
          <Route path="*" element={<NotFoundPanel />} />
        </Routes>
      </Drawer>
    </HashRouter>
  );
}
