import { useEffect } from "react";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { Menu } from "@mui/icons-material";
import { Box, Drawer, Fab, useMediaQuery } from "@mui/material";
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
import { useFavorites } from "../features/panelHooks";
import { useAppDispatch, useAppSelector } from "../features/storeHooks";
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

  const dispatch = useAppDispatch();
  const { show } = useAppSelector((state) => state.panel);
  const {
    loaded: favoritesLoaded
  } = useAppSelector((state) => state.favorites);

  const loadedRatio = useFavorites();
  useEffect(() => { dispatch(showPanel()); }, [dispatch]);

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
          <Route
            path={FAVORITES_ADDR}
            element={<FavoritesPanel loaded={favoritesLoaded} loadedRatio={loadedRatio} />}
          />
          <Route path={RESULT_ROUTES_ADDR} element={<ResultRoutesPanel />} />
          <Route path={RESULT_PLACES_ADDR} element={<ResultPlacesPanel />} />
          <Route path={RESULT_DIRECS_ADDR} element={<ResultDirecsPanel />} />
          <Route
            path={ENTITY_PLACES_ADDR + "/:smartId"}
            element={<EntityPlacePanel />}
          />
          <Route path={SESSION_SOLID_ADDR} element={<SessionSolidPanel />} />
          <Route path={HOME_ADDR} element={<Navigate to={SEARCH_ROUTES_ADDR} />} />
          <Route path="*" element={<NotFoundPanel />} />
        </Routes>
      </Drawer>
    </HashRouter>
  );
}
