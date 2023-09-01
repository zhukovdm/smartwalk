import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { AppContext } from "../../App";
import { UiPlace, UiRoute } from "../../domain/types";
import { SEARCH_DIRECS_ADDR } from "../../domain/routing";
import IdGenerator from "../../utils/idGenerator";
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
import ArrowsLinkButton from "../_shared/ArrowsLinkButton";
import CategoryFilterList from "../_shared/CategoryFilterList";
import PrecedenceViewDialog from "../_shared/PrecedenceViewDialog";
import RouteContentList from "../_shared/RouteContentList";
import SomethingActionMenu from "../_shared/SomethingActionMenu";
import SomethingSaveDialog from "../_shared/SomethingSaveDialog";
import TraversableDistance from "../_shared/TraversableDistance";
import TraversableModifyDialog from "../_shared/TraversableModifyDialog";

type ResultRoutesContentProps = {

  /** **Non-empty** list of routes.*/
  result: UiRoute[];
};

/**
 * Component presenting the content of a route search result.
 */
export default function ResultRoutesContent(
  { result }: ResultRoutesContentProps): JSX.Element {

  const { storage } = useContext(AppContext);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { index } = useAppSelector((state) => state.resultRoutes);
  const {
    resultFilters: filterList
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
    distance,
    categories,
    precedence,
    waypoints
  } = route;

  const {
    map,
    source,
    target,
    places
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

    waypoints.forEach((waypoint) => {
      const place = placesMap.get(waypoint.smartId)!;
      dispatch(appendSearchDirecsPlace({ ...place, categories: [] }));
    });

    dispatch(appendSearchDirecsPlace(routeTarget));
    navigate(SEARCH_DIRECS_ADDR);
  };

  const onPage = (_: React.ChangeEvent<unknown>, value: number) => {
    dispatch(setResultRoutesIndex(value - 1));
  };

  return (
    <Stack direction={"column"} gap={2.5}>
      <Stack gap={1}>
        <Typography>
          Found a total of <strong>{result.length}</strong> route{result.length > 1 ? "s" : ""} with distances of at most <strong>{distance}</strong>&nbsp;km, visiting at least one place from each of the <strong>{categories.length}</strong> categor{categories.length > 1 ? "ies" : "y"} (arranged by <ArrowsLinkButton onClick={() => { setShowP(true); }} />):
        </Typography>
        <CategoryFilterList
          categories={categories}
          filterList={filterList}
          found={(_: number) => true}
          onToggle={(index: number) => {
            dispatch(toggleResultRoutesFilter(index));
          }}
        />
        <PrecedenceViewDialog
          show={showP}
          categories={categories}
          precedence={precedence}
          onHide={() => { setShowP(false); }}
        />
        </Stack>
      <Box display={"flex"} justifyContent={"center"}>
        <Pagination
          page={index + 1}
          count={result.length}
          onChange={onPage}
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
            Saved as <strong>{name}</strong>.
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
      <SomethingSaveDialog
        name={name}
        show={showS}
        what={"route"}
        onHide={() => { setShowS(false); }}
        onSave={onSave}
      />
      <TraversableModifyDialog
        show={showM}
        what={"route"}
        onHide={() => { setShowM(false); }}
        onModify={onModify}
      />
      <TraversableDistance distance={path.distance} />
      <RouteContentList
        map={map}
        source={source}
        target={target}
        places={places}
        filterList={filterList}
      />
    </Stack>
  );
}
