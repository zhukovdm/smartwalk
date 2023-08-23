import { useEffect } from "react";
import { Stack } from "@mui/material";
import { StoredDirec } from "../../domain/types";
import {
  usePlaces,
  useStoredPlaces,
  useStoredSmarts
} from "../../features/sharedHooks";
import { useResultDirecsMap } from "../../features/resultHooks";
import ResultDirecsContentList from "../shared/ResultDirecsContentList";
import TraversableHeader from "../shared/TraversableHeader";
import TraversableDistance from "../shared/TraversableDistance";

type ViewerDirecContentProps = {
  direc: StoredDirec;
}

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

  useEffect(() => { map?.flyTo(source); }, [map, source]);

  return (
    <Stack gap={2.5}>
      <TraversableHeader name={name} />
      <TraversableDistance
        distance={path.distance}
      />
      <ResultDirecsContentList
        map={map}
        places={places}
      />
    </Stack>
  );
}
