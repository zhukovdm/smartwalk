import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Stack, } from "@mui/material";
import { Route } from "@mui/icons-material";
import { AppContext } from "../../App";
import { StoredPlace, StoredRoute } from "../../domain/types";
import {
  FAVOURITES_ADDR,
  RESULT_ROUTES_ADDR,
  SEARCH_ROUTES_ADDR
} from "../../domain/routing";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import {
  deleteFavouriteRoute,
  updateFavouriteRoute
} from "../../features/favouritesSlice";
import {
  setResultRoutes,
  setResultRoutesBack
} from "../../features/resultRoutesSlice";
import { RouteButton } from "../shared/buttons";
import { BusyListItem } from "../shared/list-items";
import ListItemMenu from "./ListItemMenu";
import FavouriteStub from "./FavouriteStub";
import UpdateSomethingDialog from "./UpdateSomethingDialog";
import DeleteSomethingDialog from "./DeleteSomethingDialog";

type MyRoutesListItemProps = {

  /** Index of a route in the list. */
  index: number;

  /** Route in consideration. */
  route: StoredRoute;

  /** Known places with grainId. */
  grains: Map<string, StoredPlace>;
};

function MyRoutesListItem({ index, route, grains }: MyRoutesListItemProps): JSX.Element {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { map, storage } = useContext(AppContext);
  const { name, source, target, path, places: waypoints } = route;

  const [showU, setShowU] = useState(false);
  const [showD, setShowD] = useState(false);

  const onRoute = () => {
    map?.clear();
    waypoints.forEach((place) => {
      const grain = grains.get(place.smartId);
      (grain) ? map?.addStored(grain) : map?.addTagged(place);
    });
    map?.addSource(source, false);
    map?.addTarget(target, false);
    map?.drawPolyline(path.polyline);
    map?.flyTo(source);
  }

  const onShow = () => {
    dispatch(setResultRoutes([route]));
    dispatch(setResultRoutesBack(FAVOURITES_ADDR));
    navigate(RESULT_ROUTES_ADDR);
  };

  const onUpdate = async (name: string): Promise<void> => {
    const rt = { ...route, name: name };
    await storage.updateRoute(rt);
    dispatch(updateFavouriteRoute({ route: rt, index: index }));
  };

  const onDelete = async (): Promise<void> => {
    await storage.deleteRoute(route.routeId);
    dispatch(deleteFavouriteRoute(index));
  };

  return (
    <Box>
      <BusyListItem
        label={name}
        l={<RouteButton onRoute={onRoute} />}
        r={<ListItemMenu onShow={onShow} showUpdateDialog={() => { setShowU(true); }} showDeleteDialog={() => { setShowD(true); }} />}
      />
      {showU && <UpdateSomethingDialog name={name} what="route" onHide={() => { setShowU(false); }} onUpdate={onUpdate} />}
      {showD && <DeleteSomethingDialog name={name} what="route" onHide={() => { setShowD(false); }} onDelete={onDelete} />}
    </Box>
  );
}

type MyRoutesListProps = {

  /** List of stored routes. */
  routes: StoredRoute[];
};

/**
 * Component presenting the list of passed routes.
 */
export default function MyRoutesList({ routes }: MyRoutesListProps): JSX.Element {

  const { places } = useAppSelector(state => state.favourites);

  const grains = useMemo(() => {
    return places.reduce((map, place) => {
      if (place.smartId) { map.set(place.smartId, place); }
      return map;
    }, new Map<string, StoredPlace>());
  }, [places]);

  return (
    <Box>
      {routes.length > 0
        ? <Stack direction="column" gap={2} sx={{ mb: 2 }}>
            {routes.map((r, i) => <MyRoutesListItem key={i} index={i} route={r} grains={grains} />)}
          </Stack>
        : <FavouriteStub link={SEARCH_ROUTES_ADDR} what="route" icon={(sx) => <Route sx={sx} />} />
      }
    </Box>
  )
}
