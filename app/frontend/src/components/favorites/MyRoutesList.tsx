import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import RouteIcon from "@mui/icons-material/Route";
import { AppContext } from "../../App";
import {
  SEARCH_DIRECS_ADDR,
  SEARCH_ROUTES_ADDR,
  VIEWER_ROUTE_ADDR
} from "../../domain/routing";
import {
  StoredPlace,
  StoredRoute,
  UiPlace
} from "../../domain/types";
import {
  deleteFavoriteRoute,
  updateFavoriteRoute
} from "../../features/favoritesSlice";
import {
  appendSearchDirecsPlace,
  resetSearchDirecs
} from "../../features/searchDirecsSlice";
import { setViewerRoute } from "../../features/viewerSlice";
import {
  usePlace,
  usePlaces,
  useStoredPlaces,
  useStoredSmarts
} from "../../features/sharedHooks";
import {
  useAppDispatch,
  useAppSelector
} from "../../features/storeHooks";
import StandardListItem from "../_shared/StandardListItem";
import TraversableModifyDialog from "../_shared/TraversableModifyDialog";
import ListItemMenu from "./ListItemMenu";
import FavoriteStub from "./FavoriteStub";
import SomethingEditDialog from "./SomethingEditDialog";
import SomethingDeleteDialog from "./SomethingDeleteDialog";
import StoredRouteButton from "./StoredRouteButton";

type MyRoutesListItemProps = {

  /** Index of a route in the list. */
  index: number;

  /** Route in consideration. */
  route: StoredRoute;

  /** All stored `places` (to draw pins). */
  storedPlaces: Map<string, StoredPlace>;

  /** All stored `smarts` (to draw pins). */
  storedSmarts: Map<string, StoredPlace>;
};

/**
 * List item with route icon, label, and menu.
 */
function MyRoutesListItem(
  { index, route, storedPlaces, storedSmarts }: MyRoutesListItemProps): JSX.Element {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { map, storage } = useContext(AppContext);

  const {
    name,
    source: routeSource,
    target: routeTarget,
    places: routePlaces,
    path,
    waypoints,
    categories
  } = route;

  const source = usePlace(routeSource, storedPlaces, new Map())!;
  const target = usePlace(routeTarget, storedPlaces, new Map())!;
  const places = usePlaces(routePlaces, new Map(), storedSmarts);

  const [showD, setShowD] = useState(false);
  const [showE, setShowE] = useState(false);
  const [showM, setShowM] = useState(false);

  const onRoute = () => {
    map?.clear();

    places
      .forEach((place) => {
        (!!place.placeId)
          ? map?.addStored(place, categories)
          : map?.addCommon(place, categories, false);
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

  const onEdit = async (name: string): Promise<void> => {
    const r = { ...route, name: name };
    await storage.updateRoute(r);
    dispatch(updateFavoriteRoute({ route: r, index: index }));
  };

  const onModify = (): void => {
    dispatch(resetSearchDirecs());
    dispatch(appendSearchDirecsPlace(routeSource));

    const placesMap = routePlaces
      .reduce((acc, place) => (acc.set(place.smartId, place)), new Map<string, UiPlace>())

    waypoints.forEach((waypoint) => {
      const place = placesMap.get(waypoint.smartId)!;
      dispatch(appendSearchDirecsPlace({ ...place, categories: [] }));
    });

    dispatch(appendSearchDirecsPlace(routeTarget));
    navigate(SEARCH_DIRECS_ADDR);
  };

  const onDelete = async (): Promise<void> => {
    await storage.deleteRoute(route.routeId);
    dispatch(deleteFavoriteRoute(index));
    map?.clear();
  };

  return (
    <Box
      role={"listitem"}
      aria-label={route.name}
    >
      <StandardListItem
        label={name}
        l={
          <StoredRouteButton onClick={onRoute} />
        }
        r={
          <ListItemMenu
            what={"route"}
            index={index}
            onShow={onShow}
            showEditDialog={() => { setShowE(true); }}
            showDeleteDialog={() => { setShowD(true); }}
            showModifyDialog={() => { setShowM(true); }}
          />
        }
      />
      <SomethingEditDialog
        show={showE}
        name={name}
        what={"route"}
        onHide={() => { setShowE(false); }}
        onSave={onEdit}
      />
      <TraversableModifyDialog
        show={showM}
        what={"route"}
        onHide={() => { setShowM(false); }}
        onModify={onModify}
      />
      <SomethingDeleteDialog
        show={showD}
        name={name}
        what={"route"}
        onHide={() => { setShowD(false); }}
        onDelete={onDelete}
      />
    </Box>
  );
}

type MyRoutesListProps = {

  /** Id of a label provider */
  "aria-labelledby": string;
};

/**
 * Component presenting the list of stored routes.
 */
export default function MyRoutesList(props: MyRoutesListProps): JSX.Element {

  const storedPlaces = useStoredPlaces();
  const storedSmarts = useStoredSmarts();

  const { routes } = useAppSelector((state) => state.favorites);

  return (
    <Box>
      {routes.length > 0
        ? <Stack
            {...props}
            direction={"column"}
            gap={2}
            role={"list"}
            sx={{ mb: 2 }}
          >
            {routes.map((r, i) => (
              <MyRoutesListItem
                key={i}
                index={i}
                route={r}
                storedPlaces={storedPlaces}
                storedSmarts={storedSmarts}
              />
            ))}
          </Stack>
        : <FavoriteStub
            what={"route"}
            link={SEARCH_ROUTES_ADDR}
            icon={(sx) => <RouteIcon sx={sx} />}
          />
      }
    </Box>
  )
}
