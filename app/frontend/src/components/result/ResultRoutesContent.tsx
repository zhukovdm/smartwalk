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
import { UiRoute } from "../../domain/types";
import { RESULT_ROUTES_ADDR } from "../../domain/routing";
import {
  getCopyKnownGrains,
  getSatConditions,
  replaceName
} from "../../domain/functions";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import { setResultRoutesIndex } from "../../features/resultRoutesSlice";
import { SteadyPlaceListItem } from "../shared/list-items";
import PlacesList from "./PlacesList";
import PlacesFilter from "./PlacesFilter";
import SaveRouteDialog from "./SaveRouteDialog";

type ResultRoutesContentProps = {

  /**
   * Non-empty list of routes.
   */
  result: UiRoute[];
};

/**
 * Component presenting the content of a route search result.
 */
export default function ResultRoutesContent({ result }: ResultRoutesContentProps): JSX.Element {

  const dispatch = useAppDispatch();
  const { map } = useContext(AppContext);
  const { index } = useAppSelector(state => state.resultRoutes);
  const { places: knownPlaces } = useAppSelector(state => state.favourites);

  const [saveDialog, setSaveDialog] = useState(false);

  const route = useMemo(() => result[index], [result, index]);
  const {
    routeId,
    name,
    source: s,
    target: t,
    distance,
    conditions,
    path,
    places: waypoints
  } = route;

  const knownGrains = useMemo(() => getCopyKnownGrains(knownPlaces), [knownPlaces]);

  const satConditions = useMemo(() => getSatConditions(waypoints), [waypoints]);

  const source = useMemo(() => replaceName(s, knownGrains), [s, knownGrains]);

  const target = useMemo(() => replaceName(t, knownGrains), [t, knownGrains]);

  useEffect(() => {
    map?.clear();
    waypoints.forEach((place) => {
      const grain = knownGrains.get(place.smartId);
      if (grain) { grain.categories = place.categories; } // (!) change structuredClone
      (grain) ? map?.addStored(grain) : map?.addTagged(place);
    });
    map?.addSource(source, false);
    map?.addTarget(target, false);
    map?.drawPolyline(path.polyline);
  }, [map, source, target, path, waypoints, knownGrains]);

  const onPage = (_: React.ChangeEvent<unknown>, value: number) => {
    dispatch(setResultRoutesIndex(value - 1));
  };

  return (
    <Stack direction="column" gap={2.7}>
      <Box display="flex" justifyContent="center" width="100%">
        <Pagination count={result.length} page={index + 1} onChange={onPage} />
      </Box>
      {(routeId)
        ? <Alert severity="success">
            Saved as <strong>{name}</strong>.
          </Alert>
        : <Box>
            <Alert icon={false} severity="info" action={<Button color="inherit" size="small" onClick={() => { setSaveDialog(true); }}>Save</Button>}>
              Would you like to save this route?
            </Alert>
            {saveDialog && <SaveRouteDialog index={index} route={route} onHide={() => { setSaveDialog(false); }} />}
          </Box>
      }
      <Box display="flex" alignItems="center">
        <Typography fontSize="1.2rem">
          Distance:&nbsp;&nbsp;&nbsp;<strong>{Number(path.distance.toFixed(2))}</strong> / {distance} km
        </Typography>
      </Box>
      <Stack direction="row" justifyContent="center" flexWrap="wrap" gap={2}>
        {conditions.map((c, i) => (
          <PlacesFilter
            key={i}
            found={satConditions.has(c.keyword)}
            active={false}
            disabled={true}
            condition={c}
            onToggle={() => {}}
          />
        ))}
      </Stack>
      <Stack direction="column" gap={2}>
        <SteadyPlaceListItem
          kind="source"
          label={source.name}
          onPlace={() => { map?.flyTo(source); }}
        />
        <PlacesList back={RESULT_ROUTES_ADDR} places={waypoints} grains={knownGrains} />
        <SteadyPlaceListItem
          kind="target"
          label={target.name}
          onPlace={() => { map?.flyTo(target); }}
        />
      </Stack>
    </Stack>
  );
}
