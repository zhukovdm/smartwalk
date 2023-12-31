import {
  Navigate,
  Route,
  Routes
} from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import useMediaQuery from "@mui/material/useMediaQuery";
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
} from "../utils/routing";
import { useAppSelector } from "../features/storeHooks";
import EntityPlacePanel from "./EntityPlacePanel";
import NotFoundPanel from "./NotFoundPanel";
import SearchDirecsPanel from "./SearchDirecsPanel";
import SearchPlacesPanel from "./SearchPlacesPanel";
import SearchRoutesPanel from "./SearchRoutesPanel";
import ResultDirecsPanel from "./ResultDirecsPanel";
import ResultPlacesPanel from "./ResultPlacesPanel";
import ResultRoutesPanel from "./ResultRoutesPanel";
import FavoritesPanel from "./FavoritesPanel";
import SessionSolidPanel from "./SessionSolidPanel";
import ViewerDirecPanel from "./ViewerDirecPanel";
import ViewerPlacePanel from "./ViewerPlacePanel";
import ViewerRoutePanel from "./ViewerRoutePanel";

/**
 * Main drawer with client-side routing.
 */
export default function PanelDrawer(): JSX.Element {

  const { show } = useAppSelector((state) => state.panel);
  const {
    loaded: favoritesLoaded,
    loadedRatio: favoritesLoadedRatio
  } = useAppSelector((state) => state.favorites);

  const width = useMediaQuery("(max-width: 500px)") ? "100%" : "400px";

  return (
    <Drawer
      open={show}
      PaperProps={{ sx: { width: width } }}
      variant={"persistent"}
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
          element={<FavoritesPanel loaded={favoritesLoaded} loadedRatio={favoritesLoadedRatio} />}
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
  );
}
