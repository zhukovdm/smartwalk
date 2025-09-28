import { useEffect } from "react";
import Stack from "@mui/material/Stack";
import { StoredDirec } from "../../domain/types";
import {
  usePlaces,
  useStoredPlaces,
  useStoredSmarts
} from "../../features/sharedHooks";
import { useResultDirecsMap } from "../../features/resultHooks";
import TraversalDistance from "../_shared/TraversalDistance";
import TraversalHeader from "../_shared/TraversalHeader";
import TraversalWaypointList from "../_shared/TraversalWaypointList";

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
      <TraversalHeader name={name} />
      <TraversalDistance
        distance={path.distance}
        exceedsMaxDistance={false}
      />
      <TraversalWaypointList
        map={map}
        waypoints={waypoints}
      />
    </Stack>
  );
}
