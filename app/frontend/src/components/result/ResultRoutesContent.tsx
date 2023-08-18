import { useContext, useEffect, useMemo, useState } from "react";
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
  usePlace,
  usePlaces,
  useStoredPlaces,
  useStoredSmarts
} from "../../features/hooks";
import { useAppDispatch, useAppSelector } from "../../features/store";
import { setResultRoutesIndex } from "../../features/resultRoutesSlice";
import { SteadyPlaceListItem } from "../shared/_list-items";
import PlacesList from "./PlacesList";
import PlacesFilter from "./PlacesFilter";
import SaveRouteDialog from "./SaveRouteDialog";

type ResultRoutesContentProps = {

  /**
   * **Non-empty** list of routes.
   */
  result: UiRoute[];
};

/**
 * Component presenting the content of a route search result.
 */
export default function ResultRoutesContent(
  { result }: ResultRoutesContentProps): JSX.Element {

  const { map } = useContext(AppContext);

  const dispatch = useAppDispatch();
  const { index } = useAppSelector(state => state.resultRoutes);

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

  const places = useMemo(() => (
    usePlaces(resultPlaces, new Map(), storedSmarts)
      .map((place, i) => ({
        ...structuredClone(place), /* ! */
        categories: resultPlaces[i].categories
      }))
  ), [resultPlaces, storedSmarts]);

  useEffect(() => {
    map?.clear();

    const ps = places
      .reduce((acc, place) => (acc.set(place.smartId!, place)), new Map<string, UiPlace>());

    waypoints.forEach((waypoint) => {
      const place = ps.get(waypoint)!;
      (storedSmarts.has(place.smartId!))
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
    <Stack direction={"column"} gap={2.7}>
      <Box
        display={"flex"}
        justifyContent={"center"}
        width={"100%"}
      >
        <Pagination
          count={result.length}
          onChange={onPage}
          page={index + 1}
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
        <Typography fontSize={"1.2rem"}>
          Distance:&nbsp;&nbsp;&nbsp;<strong>{Number(path.distance.toFixed(2))}</strong> / {distance} km
        </Typography>
      </Box>
      <Stack
        direction={"row"}
        flexWrap={"wrap"}
        gap={2}
        justifyContent={"center"}
      >
        {categories.map((c, i) => (
          <PlacesFilter
            key={i}
            active={false}
            category={c}
            disabled={true}
            found={true}
            onToggle={() => {}}
          />
        ))}
      </Stack>
      <Stack direction={"column"} gap={2}>
        <SteadyPlaceListItem
          kind={"source"}
          label={source.name}
          onPlace={() => { map?.flyTo(source); }}
        />
        <PlacesList places={places} smarts={storedSmarts} />
        <SteadyPlaceListItem
          kind={"target"}
          label={target.name}
          onPlace={() => { map?.flyTo(target); }}
        />
      </Stack>
    </Stack>
  );
}
