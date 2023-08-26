import { useEffect } from "react";
import {
  HashRouter,
  Navigate,
  Route,
  Routes
} from "react-router-dom";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Fab from "@mui/material/Fab";
import useMediaQuery from "@mui/material/useMediaQuery";
import MenuIcon from "@mui/icons-material/Menu";
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
  VIEWER_DIREC_ADDR,
  VIEWER_PLACE_ADDR,
  VIEWER_ROUTE_ADDR
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
import ViewerDirecPanel from "./ViewerDirecPanel";
import ViewerPlacePanel from "./ViewerPlacePanel";
import ViewerRoutePanel from "./ViewerRoutePanel";

/**
 * Main panel drawer with routing capabilities.
 */
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
          <MenuIcon />
        </Fab>
      </Box>
      <SessionProvider />
      <Drawer
        open={show}
        variant={"persistent"}
        PaperProps={{ sx: { width: width } }}
      >
        <Routes>
          {
            /* search */
          }
          <Route path={SEARCH_ROUTES_ADDR} element={<SearchRoutesPanel />} />
          <Route path={SEARCH_PLACES_ADDR} element={<SearchPlacesPanel />} />
          <Route path={SEARCH_DIRECS_ADDR} element={<SearchDirecsPanel />} />
          {
            /* result */
          }
          <Route path={RESULT_ROUTES_ADDR} element={<ResultRoutesPanel />} />
          <Route path={RESULT_PLACES_ADDR} element={<ResultPlacesPanel />} />
          <Route path={RESULT_DIRECS_ADDR} element={<ResultDirecsPanel />} />
          {
            /* entity */
          }
          <Route
            path={ENTITY_PLACES_ADDR + "/:smartId"}
            element={<EntityPlacePanel />}
          />
          {
            /* viewer */
          }
          <Route path={VIEWER_DIREC_ADDR} element={<ViewerDirecPanel />} />
          <Route path={VIEWER_PLACE_ADDR} element={<ViewerPlacePanel />} />
          <Route path={VIEWER_ROUTE_ADDR} element={<ViewerRoutePanel />} />
          {
            /* favorites */
          }
          <Route
            path={FAVORITES_ADDR}
            element={<FavoritesPanel loaded={favoritesLoaded} loadedRatio={loadedRatio} />}
          />
          {
            /* session */
          }
          <Route path={SESSION_SOLID_ADDR} element={<SessionSolidPanel />} />
          {
            /* ... */
          }
          <Route path={HOME_ADDR} element={<Navigate to={SEARCH_ROUTES_ADDR} />} />
          <Route path={"*"} element={<NotFoundPanel />} />
        </Routes>
      </Drawer>
    </HashRouter>
  );
}
