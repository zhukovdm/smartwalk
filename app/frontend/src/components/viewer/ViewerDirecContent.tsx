import { Stack } from "@mui/material";
import { StoredDirec } from "../../domain/types";
import {
  usePlaces,
  useStoredPlaces,
  useStoredSmarts
} from "../../features/sharedHooks";
import { useResultDirecsMap } from "../../features/resultHooks";
import ResultDirecsContentList from "../result/ResultDirecsContentList";
import TraversableHeader from "../result/TraversableHeader";
import TraversableDistance from "../result/TraversableDistance";

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

  const map = useResultDirecsMap(places, path);

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
