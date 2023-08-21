import { useContext, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Pagination,
  Stack,
  Typography
} from "@mui/material";
import { AppContext } from "../../App";
import { UiPlace, UiRoute } from "../../domain/types";
import {
  setResultRoutesFilter,
  setResultRoutesIndex
} from "../../features/resultRoutesSlice";
import {
  usePlace,
  usePlaces,
  useStoredPlaces,
  useStoredSmarts
} from "../../features/sharedHooks";
import { useAppDispatch, useAppSelector } from "../../features/storeHooks";
import { FixedPlaceListItem } from "../shared/_list-items";
import PlacesList from "./PlacesList";
import CategoryFilter from "./CategoryFilter";
import SaveRouteDialog from "./SaveRouteDialog";

type ResultRoutesContentProps = {

  /** **Non-empty** list of routes.*/
  result: UiRoute[];
};

/**
 * Component presenting the content of a route search result.
 */
export default function ResultRoutesContent(
  { result }: ResultRoutesContentProps): JSX.Element {

  const { map } = useContext(AppContext);

  const dispatch = useAppDispatch();
  const { index } = useAppSelector((state) => state.resultRoutes);
  const { filters: filterList } = useAppSelector((state) => state.resultRoutes);

  const [saveDialog, setSaveDialog] = useState(false);

  const storedPlaces = useStoredPlaces();
  const storedSmarts = useStoredSmarts();
  const {
    routeId,
    source: resultSource,
    target: resultTarget,
    distance,
    categories,
    name,
    path,
    places: resultPlaces,
    waypoints // true route sequence!
  } = result[index];

  const source = usePlace(resultSource, storedPlaces, new Map())!;
  const target = usePlace(resultTarget, storedPlaces, new Map())!;

  const places = usePlaces(resultPlaces, new Map(), storedSmarts)
    .filter((place) => (
      place.categories.some((c: number) => filterList[c])));

  useEffect(() => {
    map?.clear();

    const ps = places
      .reduce((acc, place) => (acc.set(place.smartId!, place)), new Map<string, UiPlace>());

    waypoints
      .map((waypoint) => ps.get(waypoint))
      .filter((place) => !!place)
      .map((place) => place as UiPlace)
      .forEach((place) => {
        (!!place.placeId)
          ? map?.addStored(place, categories)
          : map?.addCommon(place, categories, false);
      });

    map?.addSource(source, [], false);
    map?.addTarget(target, [], false);
    map?.drawPolyline(path.polyline);
  }, [map, waypoints, source, target, path, places, storedSmarts, categories]);

  const onPage = (_: React.ChangeEvent<unknown>, value: number) => {
    dispatch(setResultRoutesIndex(value - 1));
  };

  return (
    <Stack direction={"column"} gap={2.5}>
      <Typography fontSize={"1.1rem"}>
        Found a total of <strong>{result.length}</strong> route{result.length > 1 ? "s" : ""} with a distance of at most <strong>{distance}</strong>&nbsp;km. Each of them visits at least one place from <strong>{categories.length}</strong> categories.
      </Typography>
      <Box display={"flex"} justifyContent={"center"}>
        <Pagination
          page={index + 1}
          count={result.length}
          onChange={onPage}
        />
      </Box>
      {(routeId)
        ? <Alert severity={"success"}>
            Saved as <strong>{name}</strong>.
          </Alert>
        : <Box>
            <Alert
              icon={false}
              severity={"info"}
              action={
                <Button
                  color={"inherit"}
                  size={"small"}
                  onClick={() => { setSaveDialog(true); }}
                >
                  <span>Save</span>
                </Button>
              }
            >
              Would you like to save this route?
            </Alert>
            {saveDialog && <SaveRouteDialog route={result[index]} index={index} onHide={() => { setSaveDialog(false); }} />}
          </Box>
      }
      <Box display={"flex"} alignItems={"center"}>
        <Typography fontSize={"1.1rem"}>
          Distance:&nbsp;&nbsp;&nbsp;<strong>{Number(path.distance.toFixed(2))}</strong> km
        </Typography>
      </Box>
      <Stack
        direction={"row"}
        flexWrap={"wrap"}
        justifyContent={"center"}
        spacing={2}
      >
        {categories.map((c, i) => {
          const active = filterList[i];
          return (
            <CategoryFilter
              key={i}
              active={active}
              index={i}
              category={c}
              found={true}
              onToggle={() => {
                dispatch(setResultRoutesFilter({ filter: !active, index: i }));
              }}
            />
          );
        })}
      </Stack>
      <Stack direction={"column"} gap={2}>
        <FixedPlaceListItem
          kind={"source"}
          label={source.name}
          onPlace={() => { map?.flyTo(source); }}
        />
        {filterList.some((f) => f) && <PlacesList places={places} />}
        <FixedPlaceListItem
          kind={"target"}
          label={target.name}
          onPlace={() => { map?.flyTo(target); }}
        />
      </Stack>
    </Stack>
  );
}
