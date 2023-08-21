import {
  Divider,
  Stack,
  Typography
} from "@mui/material";
import { StoredDirec } from "../../domain/types";
import {
  usePlaces,
  useStoredPlaces,
  useStoredSmarts
} from "../../features/sharedHooks";
import { useResultDirecsMap } from "../../features/resultHooks";
import ResultDirecsContentDistance from "../result/ResultDirecsContentDistance";
import ResultDirecsContentList from "../result/ResultDirecsContentList";

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
      <Stack gap={1}>
        <Typography fontSize={"large"}>{name}</Typography>
        <Divider sx={{ background: "lightgrey" }} />
      </Stack>
      <ResultDirecsContentDistance
        distance={path.distance}
      />
      <ResultDirecsContentList
        map={map}
        places={places}
      />
    </Stack>
  );
}
