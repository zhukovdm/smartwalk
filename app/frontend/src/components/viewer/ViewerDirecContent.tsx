import { useEffect } from "react";
import Stack from "@mui/material/Stack";
import { StoredDirec } from "../../domain/types";
import {
  usePlaces,
  useStoredPlaces,
  useStoredSmarts
} from "../../features/sharedHooks";
import { useResultDirecsMap } from "../../features/resultHooks";
import DirecContentList from "../_shared/DirecContentList";
import TraversableHeader from "../_shared/TraversableHeader";
import TraversableDistance from "../_shared/TraversableDistance";

type ViewerDirecContentProps = {

  /** Direction to view */
  direc: StoredDirec;
}

/**
 * View of a stored direction.
 */
export default function ViewerDirecContent(
  { direc }: ViewerDirecContentProps): JSX.Element {

  const {
    name,
    path,
    waypoints
  } = direc;

  const places = usePlaces(waypoints, useStoredPlaces(), useStoredSmarts());
  const source = places[0];

  const map = useResultDirecsMap(places, path);

  // eslint-disable-next-line
  useEffect(() => { map?.flyTo(source); }, []);

  return (
    <Stack gap={2.5}>
      <TraversableHeader name={name} />
      <TraversableDistance
        distance={path.distance}
      />
      <DirecContentList
        map={map}
        places={places}
      />
    </Stack>
  );
}
