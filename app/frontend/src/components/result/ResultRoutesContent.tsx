import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { AppContext } from "../../App";
import type { UiPlace } from "../../domain/types";
import { escapeHtml } from "../../utils/functions";
import IdGenerator from "../../utils/idGenerator";
import { SEARCH_DIRECS_ADDR } from "../../utils/routing";
import {
  toggleResultRoutesFilter,
  setResultRoutesIndex,
  updateResultRoute
} from "../../features/resultRoutesSlice";
import { createFavoriteRoute } from "../../features/favoritesSlice";
import {
  appendSearchDirecsPlace,
  resetSearchDirecs
} from "../../features/searchDirecsSlice";
import {
  useAppDispatch,
  useAppSelector
} from "../../features/storeHooks";
import { useResultRoute } from "../../features/resultHooks";
import ArrowViewDialog from "../_shared/ArrowViewDialog";
import ArrowsLinkButton from "../_shared/ArrowsLinkButton";
import CategoryFilterList from "../_shared/CategoryFilterList";
import RouteContentList from "../_shared/RouteContentList";
import SomethingActionMenu from "../_shared/SomethingActionMenu";
import TraversalDistance from "../_shared/TraversalDistance";
import TraversalModifyDialog from "../_shared/TraversalModifyDialog";
import TraversalSaveDialog from "../_shared/TraversalSaveDialog";

/**
 * Component presenting the content of a route search result.
 */
export default function ResultRoutesContent(): JSX.Element {

  const { storage } = useContext(AppContext);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    index,
    result,
    categoryFilters: filterList
  } = useAppSelector((state) => state.resultRoutes);

  const [showM, setShowM] = useState(false);
  const [showS, setShowS] = useState(false);
  const [showP, setShowP] = useState(false);

  const route = result[index];

  const {
    routeId,
    name,
    path,
    source: routeSource,
    target: routeTarget,
    places: routePlaces,
    maxDistance,
    categories,
    arrows,
    waypoints: routeWaypoints
  } = route;

  const {
    map,
    source,
    target,
    waypoints: places
  } = useResultRoute(result[index], filterList);

  const onSave = async (name: string) => {
    const r = { ...route, name: name };
    const s = {
      ...r,
      routeId: IdGenerator.generateId(r)
    };
    await storage.createRoute(s);
    dispatch(createFavoriteRoute(s));
    dispatch(updateResultRoute({ route: s, index: index }));
  };

  const onModify = () => {
    dispatch(resetSearchDirecs());
    dispatch(appendSearchDirecsPlace(routeSource));

    const placesMap = routePlaces
      .reduce((acc, place) => (acc.set(place.smartId!, place)), new Map<string, UiPlace>())

    routeWaypoints.forEach((w) => {
      dispatch(appendSearchDirecsPlace(
        { ...placesMap.get(w.smartId)!, categories: [] }));
    });

    dispatch(appendSearchDirecsPlace(routeTarget));
    navigate(SEARCH_DIRECS_ADDR);
  };

  const onPagination = (_: React.ChangeEvent<unknown>, value: number) => {
    dispatch(setResultRoutesIndex(value - 1));
  };

  return (
    <Stack direction={"column"} gap={2.5}>
      <Stack gap={1}>
        <Typography>
          Found a total of <strong>{result.length}</strong> route{result.length > 1 ? "s" : ""} with {result.length > 1 ? "distances" : "a distance"} of at most <strong>{maxDistance}</strong>&nbsp;km, visiting at least one place from {(categories.length > 1) ? "each of the following categories" : "the following category"} (arranged by <ArrowsLinkButton onClick={() => { setShowP(true); }} />):
        </Typography>
        <CategoryFilterList
          categories={categories}
          filterList={filterList}
          found={(_: number) => true}
          onToggle={(index: number) => {
            dispatch(toggleResultRoutesFilter(index));
          }}
        />
        <ArrowViewDialog
          show={showP}
          categories={categories}
          arrows={arrows}
          onHide={() => { setShowP(false); }}
        />
        </Stack>
      <Box display={"flex"} justifyContent={"center"}>
        <Pagination
          page={index + 1}
          count={result.length}
          onChange={onPagination}
        />
      </Box>
      {(routeId)
        ? <Alert
            icon={false}
            severity={"success"}
            action={
              <SomethingActionMenu
                showModifyDialog={() => { setShowM(true); }}
              />
            }
          >
            Saved as <strong>{escapeHtml(name)}</strong>.
          </Alert>
        : <Alert
            icon={false}
            severity={"info"}
            action={
              <SomethingActionMenu
                showSaveDialog={() => { setShowS(true); }}
                showModifyDialog={() => { setShowM(true); }}
              />
            }
          >
            This route is not in your Favorites yet.
          </Alert>
      }
      <TraversalSaveDialog
        show={showS}
        what={"route"}
        onHide={() => { setShowS(false); }}
        onSave={onSave}
      />
      <TraversalModifyDialog
        show={showM}
        what={"route"}
        onHide={() => { setShowM(false); }}
        onModify={onModify}
      />
      <TraversalDistance distance={path.distance} />
      <RouteContentList
        map={map}
        source={source}
        target={target}
        waypoints={places}
        filterList={filterList}
      />
    </Stack>
  );
}
