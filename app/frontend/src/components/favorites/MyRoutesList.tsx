import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Stack } from "@mui/material";
import { Route } from "@mui/icons-material";
import { AppContext } from "../../App";
import {
  Place,
  StoredPlace,
  StoredRoute
} from "../../domain/types";
import {
  SEARCH_ROUTES_ADDR,
  VIEWER_ROUTE_ADDR
} from "../../domain/routing";
import { useAppDispatch } from "../../features/store";
import {
  deleteFavoriteRoute,
  updateFavoriteRoute
} from "../../features/favoritesSlice";
import { RouteButton } from "../shared/_buttons";
import { BusyListItem } from "../shared/_list-items";
import ListItemMenu from "./ListItemMenu";
import FavoriteStub from "./FavoriteStub";
import UpdateSomethingDialog from "./UpdateSomethingDialog";
import DeleteSomethingDialog from "./DeleteSomethingDialog";
import { setViewerRoute } from "../../features/viewerSlice";

type MyRoutesListItemProps = {

  /** Index of a route in the list. */
  index: number;

  /** Route in consideration. */
  route: StoredRoute;

  /** All stored `smarts` (to draw pins). */
  storedSmarts: Map<string, StoredPlace>;
};

function MyRoutesListItem({ index, route, storedSmarts }: MyRoutesListItemProps): JSX.Element {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { map, storage } = useContext(AppContext);

  const { name, source, target, path, waypoints, categories } = route;

  const routeCats = useMemo(() => (
    categories.map((category) => category.keyword)
  ), [categories]);

  const routeSmarts = useMemo(() => (
    route.places.reduce((acc, place) => (acc.set(place.smartId, place)), new Map<string, Place>())
  ), [route]);

  const [showU, setShowU] = useState(false);
  const [showD, setShowD] = useState(false);

  const onRoute = () => {
    map?.clear();
    waypoints.forEach((waypoint) => {
      const smart = storedSmarts.get(waypoint);
      smart
        ? map?.addStored(smart, routeCats)
        : map?.addCommon(routeSmarts.get(waypoint)!, routeCats, false);
    });
    map?.addSource(source, [], false);
    map?.addTarget(target, [], false);
    map?.drawPolyline(path.polyline);
    map?.flyTo(source);
  }

  const onShow = () => {
    dispatch(setViewerRoute(route));
    navigate(VIEWER_ROUTE_ADDR);
  };

  const onUpdate = async (name: string): Promise<void> => {
    const r = { ...route, name: name };
    await storage.updateRoute(r);
    dispatch(updateFavoriteRoute({ route: r, index: index }));
  };

  const onDelete = async (): Promise<void> => {
    await storage.deleteRoute(route.routeId);
    dispatch(deleteFavoriteRoute(index));
  };

  return (
    <Box>
      <BusyListItem
        label={name}
        l={<RouteButton onRoute={onRoute} />}
        r={
          <ListItemMenu
            onShow={onShow}
            showDeleteDialog={() => { setShowD(true); }}
            showUpdateDialog={() => { setShowU(true); }}
          />
        }
      />
      <DeleteSomethingDialog
        show={showD}
        name={name}
        what={"route"}
        onHide={() => { setShowD(false); }}
        onDelete={onDelete}
      />
      <UpdateSomethingDialog
        show={showU}
        name={name}
        what={"route"}
        onHide={() => { setShowU(false); }}
        onUpdate={onUpdate}
      />
    </Box>
  );
}

type MyRoutesListProps = {

  /** List of stored routes. */
  routes: StoredRoute[];

  /** List of all stored places (to draw pins). */
  places: StoredPlace[];
};

/**
 * Component presenting the list of passed routes.
 */
export default function MyRoutesList({ routes, places }: MyRoutesListProps): JSX.Element {

  const storedSmarts = useMemo(() => (
    places.reduce((acc, place) => (place.smartId ? acc.set(place.smartId, place) : acc), new Map<string, StoredPlace>())
  ), [places]);

  return (
    <Box>
      {routes.length > 0
        ? <Stack direction={"column"} gap={2} sx={{ mb: 2 }}>
            {routes.map((r, i) => <MyRoutesListItem key={i} index={i} route={r} storedSmarts={storedSmarts} />)}
          </Stack>
        : <FavoriteStub
            what={"route"}
            link={SEARCH_ROUTES_ADDR}
            icon={(sx) => <Route sx={sx} />}
          />
      }
    </Box>
  )
}
