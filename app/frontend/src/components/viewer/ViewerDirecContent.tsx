import { useEffect } from "react";
import Stack from "@mui/material/Stack";
import { StoredDirec } from "../../domain/types";
import {
  usePlaces,
  useStoredPlaces,
  useStoredSmarts
} from "../../features/sharedHooks";
import { useResultDirecsMap } from "../../features/resultHooks";
import TraversableDistance from "../_shared/TraversableDistance";
import TraversableHeader from "../_shared/TraversableHeader";
import TraversableWaypointList from "../_shared/TraversableWaypointList";

export type ViewerDirecContentProps = {

  /** Direction to view */
  direc: StoredDirec;
}

/**
 * Simple view of a stored direction (name, distance, and waypoints).
 */
export default function ViewerDirecContent(
  { direc }: ViewerDirecContentProps): JSX.Element {

  const {
    name,
    path,
    waypoints: direcWaypoints
  } = direc;

  const waypoints = usePlaces(direcWaypoints, useStoredPlaces(), useStoredSmarts());

  const map = useResultDirecsMap(waypoints, path);

  // eslint-disable-next-line
  useEffect(() => { map?.flyTo(waypoints[0][0]); }, []);

  return (
    <Stack gap={2.5}>
      <TraversableHeader name={name} />
      <TraversableDistance
        distance={path.distance}
      />
      <TraversableWaypointList
        map={map}
        waypoints={waypoints}
      />
    </Stack>
  );
}
